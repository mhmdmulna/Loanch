import "dotenv/config";
import { readFile } from "node:fs/promises";
import { Contract, JsonRpcProvider, getAddress, parseUnits } from "ethers";
import { DEMO_CUSTOMERS, DEMO_POOL } from "../config/demo-customers.mjs";

const provider = new JsonRpcProvider(process.env.VITE_BOT_CHAIN_RPC_URL);
const network = await provider.getNetwork();
if (network.chainId !== 31337n) throw new Error("Demo seeding requires local chain ID 31337.");

const abi = JSON.parse(await readFile("./contracts/abi/LoanchPool.json", "utf8"));
const admin = await provider.getSigner(0);
const liquidityProvider = await provider.getSigner(DEMO_POOL.liquidityProviderAccountIndex);
const pool = new Contract(process.env.VITE_LOANCH_CONTRACT_ADDRESS, abi, admin);
const poolAsSaver = pool.connect(liquidityProvider);
const assetAddress = await pool.asset();
const tokenAbi = [
  "function decimals() view returns (uint8)",
  "function mint(address,uint256)",
  "function approve(address,uint256) returns (bool)",
];
const token = new Contract(assetAddress, tokenAbi, admin);
const tokenAsSaver = token.connect(liquidityProvider);
const decimals = Number(await token.decimals());
const poolAddress = await pool.getAddress();

const minimumLiquidity = parseUnits(DEMO_POOL.minimumLiquidityProviderDepositTokens, decimals);
const stats = await pool.getPoolStats();
if (stats.saverPrincipalClaims < minimumLiquidity) {
  const liquidityDelta = minimumLiquidity - stats.saverPrincipalClaims;
  await (await token.mint(await liquidityProvider.getAddress(), liquidityDelta)).wait();
  await (await tokenAsSaver.approve(poolAddress, liquidityDelta)).wait();
  await (await poolAsSaver.deposit(liquidityDelta)).wait();
}

const results = [];
for (const configuredCustomer of DEMO_CUSTOMERS) {
  const customer = getAddress(configuredCustomer.address);
  if (configuredCustomer.riskScore < 0 || configuredCustomer.riskScore > 100) {
    throw new Error(`Invalid risk score for ${customer}.`);
  }

  const customerSigner = await provider.getSigner(customer);
  if (getAddress(await customerSigner.getAddress()) !== customer) {
    throw new Error(`Demo customer ${customer} is not unlocked by the local node.`);
  }
  const customerPool = pool.connect(customerSigner);
  const customerToken = token.connect(customerSigner);
  await (await pool.setBorrowerRiskScore(customer, configuredCustomer.riskScore)).wait();

  const targetDeposit = parseUnits(configuredCustomer.depositPositionTokens, decimals);
  const position = await pool.getSaverPosition(customer);
  const depositDelta = position.principalClaim < targetDeposit ? targetDeposit - position.principalClaim : 0n;
  const targetStake = parseUnits(configuredCustomer.freeStakeTokens, decimals);
  const currentStake = await pool.freeStake(customer);
  const stakeDelta = currentStake < targetStake ? targetStake - currentStake : 0n;
  const fundingDelta = depositDelta + stakeDelta;
  if (fundingDelta > 0n) {
    await (await token.mint(customer, fundingDelta)).wait();
    await (await customerToken.approve(poolAddress, fundingDelta)).wait();
    if (depositDelta > 0n) await (await customerPool.deposit(depositDelta)).wait();
    if (stakeDelta > 0n) await (await customerPool.stake(stakeDelta)).wait();
  }

  const sampleLoan = parseUnits(configuredCustomer.sampleLoanTokens, decimals);
  const duration = BigInt(configuredCustomer.sampleLoanDurationDays) * 86400n;
  const [reason] = await pool.previewLoan(customer, sampleLoan, duration);
  if (reason !== 0n) throw new Error(`Demo customer ${customer} is not eligible: reason ${reason}.`);
  results.push({
    customer,
    riskScore: configuredCustomer.riskScore,
    depositPositionTokens: configuredCustomer.depositPositionTokens,
    freeStakeTokens: configuredCustomer.freeStakeTokens,
    sampleLoanTokens: configuredCustomer.sampleLoanTokens,
    sampleLoanDurationDays: configuredCustomer.sampleLoanDurationDays,
    eligible: true,
  });
}

console.log(JSON.stringify({ chainId: network.chainId.toString(), customers: results }));
