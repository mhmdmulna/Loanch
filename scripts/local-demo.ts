import hre from "hardhat";

const { ethers } = await hre.network.create();
const [admin, saver, borrower] = await ethers.getSigners();
const token = await ethers.deployContract("MockToken");
const pool = await ethers.deployContract("LoanchPool", [await token.getAddress(), 2_000]);
await token.waitForDeployment();
await pool.waitForDeployment();

for (const user of [saver, borrower]) {
  await (await token.mint(user.address, ethers.parseUnits("10000", 18))).wait();
  await (await token.connect(user).approve(await pool.getAddress(), ethers.MaxUint256)).wait();
  await (await pool.setIdentityVerification(user.address, true)).wait();
}

await (await pool.setBorrowerRiskScore(borrower.address, 80)).wait();
await (await pool.connect(saver).deposit(ethers.parseUnits("1000", 18))).wait();
await (await pool.connect(borrower).stake(ethers.parseUnits("25", 18))).wait();
await (await pool.connect(borrower).requestLoan(ethers.parseUnits("500", 18), 30n * 86400n)).wait();
await (await pool.connect(borrower).repayLoan(1n, ethers.parseUnits("550", 18))).wait();
await (await pool.connect(saver).claimReturn()).wait();

const loan = await pool.getLoan(1n);
const saverPosition = await pool.getSaverPosition(saver.address);
const stats = await pool.getPoolStats();

console.log(JSON.stringify({
  chainId: (await ethers.provider.getNetwork()).chainId.toString(),
  admin: admin.address,
  saver: saver.address,
  borrower: borrower.address,
  asset: await token.getAddress(),
  pool: await pool.getAddress(),
  loanStatus: loan.status.toString(),
  saverPrincipal: saverPosition.principalClaim.toString(),
  saverReturnLiability: stats.saverReturnLiability.toString(),
  platformRevenue: stats.platformRevenue.toString(),
  lossReserve: stats.lossReserveAmount.toString(),
}, null, 2));
