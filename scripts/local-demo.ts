import hre from "hardhat";

const { ethers } = await hre.network.create();
const [admin, saver, borrower] = await ethers.getSigners();
const pool = await ethers.deployContract("LoanchPool", [2_000]);
await pool.waitForDeployment();

await (await pool.setBorrowerRiskScore(borrower.address, 80)).wait();
await (await pool.connect(saver).deposit({ value: ethers.parseEther("1000") })).wait();
await (await pool.connect(borrower).stake({ value: ethers.parseEther("25") })).wait();
await (await pool.connect(borrower).requestLoan(ethers.parseUnits("500", 18), 30n * 86400n)).wait();
await (await pool.connect(borrower).repayLoan(1n, { value: ethers.parseEther("550") })).wait();
await (await pool.connect(saver).claimReturn()).wait();

const loan = await pool.getLoan(1n);
const saverPosition = await pool.getSaverPosition(saver.address);
const stats = await pool.getPoolStats();

console.log(JSON.stringify({
  chainId: (await ethers.provider.getNetwork()).chainId.toString(),
  admin: admin.address,
  saver: saver.address,
  borrower: borrower.address,
  asset: "native BOT",
  pool: await pool.getAddress(),
  loanStatus: loan.status.toString(),
  saverPrincipal: saverPosition.principalClaim.toString(),
  saverReturnLiability: stats.saverReturnLiability.toString(),
  platformRevenue: stats.platformRevenue.toString(),
  lossReserve: stats.lossReserveAmount.toString(),
}, null, 2));
