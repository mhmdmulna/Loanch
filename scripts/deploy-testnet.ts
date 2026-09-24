import { network } from "hardhat"

const reserveBps = 2_000n

const { ethers } = await network.create()
const [deployer] = await ethers.getSigners()
const chain = await ethers.provider.getNetwork()

if (chain.chainId !== 968n) {
  throw new Error(`Expected BOT Chain Testnet chain ID 968, received ${chain.chainId}`)
}

console.log(`Deployer: ${deployer.address}`)
console.log(`Balance: ${ethers.formatEther(await ethers.provider.getBalance(deployer.address))} BOT`)

const pool = await ethers.deployContract("LoanchPool", [reserveBps])
await pool.waitForDeployment()
const deploymentTx = pool.deploymentTransaction()
const deploymentReceipt = deploymentTx ? await deploymentTx.wait() : null
const poolAddress = await pool.getAddress()
console.log(`LoanchPool: ${poolAddress}`)
console.log(`Deployment transaction: ${deploymentTx?.hash ?? "unavailable"}`)
console.log(`Deployment block: ${deploymentReceipt?.blockNumber ?? "unavailable"}`)

for (let attempt = 0; attempt < 10 && await ethers.provider.getCode(poolAddress) === "0x"; attempt++) {
  await new Promise(resolve => setTimeout(resolve, 1_000))
}
if (await ethers.provider.getCode(poolAddress) === "0x") throw new Error("Deployment receipt confirmed but bytecode is not available from the RPC")

console.log(`Owner: ${await pool.owner()}`)
console.log("Asset: native BOT")
console.log(`Reserve BPS: ${(await pool.reserveBps()).toString()}`)
console.log(`Explorer: https://scan.bohr.life/address/${poolAddress}`)
