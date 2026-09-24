import "dotenv/config";
import { readFile } from "node:fs/promises";
import { Contract, JsonRpcProvider, getAddress, parseEther } from "ethers";
import { DEMO_CUSTOMERS, DEMO_POOL } from "../config/demo-customers.mjs";

const provider = new JsonRpcProvider(process.env.VITE_BOT_CHAIN_RPC_URL);
const network = await provider.getNetwork();
if (network.chainId !== 31337n) throw new Error("Demo seeding requires local chain ID 31337.");

const abi = JSON.parse(await readFile("./contracts/abi/LoanchPool.json", "utf8"));
const admin = await provider.getSigner(0);
const liquidityProvider = await provider.getSigner(DEMO_POOL.liquidityProviderAccountIndex);
const pool = new Contract(process.env.VITE_LOANCH_CONTRACT_ADDRESS, abi, admin);
const poolAsSaver = pool.connect(liquidityProvider);

const minimumLiquidity = parseEther(DEMO_POOL.minimumLiquidityProviderDepositTokens);
const stats = await pool.getPoolStats();
if (stats.saverPrincipalClaims < minimumLiquidity) {
  const liquidityDelta = minimumLiquidity - stats.saverPrincipalClaims;
  await (await poolAsSaver.deposit({ value: liquidityDelta })).wait();
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
  await (await pool.setBorrowerRiskScore(customer, configuredCustomer.riskScore)).wait();

  const targetDeposit = parseEther(configuredCustomer.depositPositionTokens);
  const position = await pool.getSaverPosition(customer);
  const depositDelta = position.principalClaim < targetDeposit ? targetDeposit - position.principalClaim : 0n;
  const targetStake = parseEther(configuredCustomer.freeStakeTokens);
  const currentStake = await pool.freeStake(customer);
  const stakeDelta = currentStake < targetStake ? targetStake - currentStake : 0n;
  if (depositDelta > 0n) await (await customerPool.deposit({ value: depositDelta })).wait();
  if (stakeDelta > 0n) await (await customerPool.stake({ value: stakeDelta })).wait();

  const sampleLoan = parseEther(configuredCustomer.sampleLoanTokens);
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
