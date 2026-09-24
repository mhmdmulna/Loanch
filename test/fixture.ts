import hre from "hardhat";

export const { ethers } = await hre.network.create();

export async function deployFixture() {
  const [owner, saverA, saverB, borrower, other] = await ethers.getSigners();
  const token = await ethers.deployContract("MockToken");
  const pool = await ethers.deployContract("LoanchPool", [await token.getAddress(), 2_000]);
  const poolAddress = await pool.getAddress();
  for (const user of [owner, saverA, saverB, borrower, other]) {
    await (await token.mint(user.address, 1_000_000n)).wait();
    await (await token.connect(user).approve(poolAddress, 1_000_000n)).wait();
  }
  return { owner, saverA, saverB, borrower, other, token, pool };
}
