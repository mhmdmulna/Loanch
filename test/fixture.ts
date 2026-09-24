import hre from "hardhat";

export const { ethers } = await hre.network.create();

export async function deployFixture() {
  const [owner, saverA, saverB, borrower, other] = await ethers.getSigners();
  const pool = await ethers.deployContract("LoanchPool", [2_000]);
  return { owner, saverA, saverB, borrower, other, pool };
}
