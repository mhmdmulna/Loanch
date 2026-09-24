import { network } from "hardhat"

const { ethers } = await network.create()
const [signer] = await ethers.getSigners()
const chain = await ethers.provider.getNetwork()
const poolAddress = process.env.BOT_CHAIN_POOL_ADDRESS

if (chain.chainId !== 968n) throw new Error(`Expected BOT Chain Testnet chain ID 968, received ${chain.chainId}`)
if (!poolAddress || !ethers.isAddress(poolAddress)) throw new Error("BOT_CHAIN_POOL_ADDRESS is missing or invalid")
if (await ethers.provider.getCode(poolAddress) === "0x") throw new Error("No contract bytecode exists at BOT_CHAIN_POOL_ADDRESS")

const pool = await ethers.getContractAt("LoanchPool", poolAddress, signer)
if ((await pool.owner()).toLowerCase() !== signer.address.toLowerCase()) throw new Error("Smoke signer is not the pool owner")

const depositAmount = ethers.parseEther("0.01")
const loanAmount = ethers.parseEther("0.005")
const stakeAmount = await pool.requiredStake(loanAmount)
const repaymentAmount = loanAmount + loanAmount / 10n
const hashes: Record<string, string> = {}

let tx = await pool.setBorrowerRiskScore(signer.address, 80)
hashes.setRisk = tx.hash
await tx.wait()

tx = await pool.deposit({ value: depositAmount })
hashes.deposit = tx.hash
await tx.wait()

tx = await pool.stake({ value: stakeAmount })
hashes.stake = tx.hash
await tx.wait()

tx = await pool.requestLoan(loanAmount, 86400n)
hashes.loan = tx.hash
await tx.wait()

const loanId = await pool.activeLoanId(signer.address)
tx = await pool.repayLoan(loanId, { value: repaymentAmount })
hashes.repay = tx.hash
await tx.wait()

tx = await pool.claimReturn()
hashes.claim = tx.hash
await tx.wait()

tx = await pool.withdraw(depositAmount)
hashes.withdraw = tx.hash
await tx.wait()

const [loan, position, stats] = await Promise.all([
  pool.getLoan(loanId),
  pool.getSaverPosition(signer.address),
  pool.getPoolStats(),
])

if (loan.status !== 2n || position.principalClaim !== 0n || position.claimableReturn !== 0n) {
  throw new Error("Smoke flow finished with unexpected user state")
}
if (stats.activeLoanCount !== 0n || stats.activeLoanPrincipal !== 0n || stats.lockedStake !== 0n) {
  throw new Error("Smoke flow finished with unsettled loan or stake state")
}

console.log(JSON.stringify({
  chainId: chain.chainId.toString(),
  pool: poolAddress,
  account: signer.address,
  loanId: loanId.toString(),
  loanStatus: loan.status.toString(),
  remainingContractBalance: (await ethers.provider.getBalance(poolAddress)).toString(),
  hashes,
}, null, 2))
