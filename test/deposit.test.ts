import assert from "node:assert/strict";
import { expect } from "chai";
import hre from "hardhat";

const { ethers } = await hre.network.create();

describe("LoanchPool deposits", function () {
  async function deployPool(reserveBps = 2_000) {
    const [owner, saverA, saverB] = await ethers.getSigners();
    const token = await ethers.deployContract("MockToken");
    const pool = await ethers.deployContract("LoanchPool", [await token.getAddress(), reserveBps]);
    for (const saver of [saverA, saverB]) {
      await (await token.mint(saver.address, 1_000n)).wait();
      await (await token.connect(saver).approve(await pool.getAddress(), 1_000n)).wait();
    }
    return { owner, saverA, saverB, token, pool };
  }

  it("mints a mock ERC-20 for local tests", async function () {
    const token = await ethers.deployContract("MockToken");
    const [user] = await ethers.getSigners();
    await (await token.mint(user.address, 100n)).wait();
    expect(await token.balanceOf(user.address)).to.equal(100n);
  });

  it("rejects invalid asset addresses and an initial reserve ratio above 100%", async function () {
    const [user] = await ethers.getSigners();
    const token = await ethers.deployContract("MockToken");
    await assert.rejects(ethers.deployContract("LoanchPool", [ethers.ZeroAddress, 2_000]), /InvalidAsset/);
    await assert.rejects(ethers.deployContract("LoanchPool", [user.address, 2_000]), /InvalidAsset/);
    await assert.rejects(ethers.deployContract("LoanchPool", [await token.getAddress(), 10_001]), /InvalidReserveRatio/);
  });

  it("allows an unverified wallet to deposit in demo mode", async function () {
    const { saverA, pool } = await deployPool();
    await (await pool.connect(saverA).deposit(100n)).wait();
    expect(await pool.identityVerified(saverA.address)).to.equal(false);
    expect((await pool.getSaverPosition(saverA.address)).shares).to.equal(100n);
  });

  it("keeps identity metadata owner-managed without gating deposits", async function () {
    const { saverA, saverB, pool } = await deployPool();
    await assert.rejects(pool.connect(saverB).setIdentityVerification(saverA.address, true), /OwnableUnauthorizedAccount/);
    const receipt = await (await pool.setIdentityVerification(saverA.address, true)).wait();
    const event = receipt?.logs.map((log) => {
      try { return pool.interface.parseLog(log); } catch { return null; }
    }).find((log) => log?.name === "IdentityVerificationUpdated");
    expect(event?.args.user).to.equal(saverA.address);
    expect(event?.args.verified).to.equal(true);
    expect(await pool.identityVerified(saverA.address)).to.equal(true);
    await (await pool.connect(saverA).deposit(100n)).wait();
    await (await pool.setIdentityVerification(saverA.address, false)).wait();
    await (await pool.connect(saverA).deposit(1n)).wait();
    expect((await pool.getSaverPosition(saverA.address)).shares).to.equal(101n);
  });

  it("rejects a zero deposit without moving tokens or minting shares", async function () {
    const { saverA, token, pool } = await deployPool();
    await (await pool.setIdentityVerification(saverA.address, true)).wait();
    await assert.rejects(pool.connect(saverA).deposit(0n), /ZeroDeposit/);
    expect(await pool.totalShares()).to.equal(0n);
    expect(await pool.saverPrincipalClaims()).to.equal(0n);
    expect(await token.balanceOf(await pool.getAddress())).to.equal(0n);
  });

  it("mints shares 1:1 initially and gives a new Saver weight of 1x", async function () {
    const { saverA, token, pool } = await deployPool();
    await (await pool.setIdentityVerification(saverA.address, true)).wait();
    const receipt = await (await pool.connect(saverA).deposit(500n)).wait();
    const saver = await pool.getSaverPosition(saverA.address);
    const stats = await pool.getPoolStats();
    expect(saver.shares).to.equal(500n);
    expect(saver.weightBps).to.equal(10_000n);
    expect(saver.weightedShares).to.equal(500n);
    expect(saver.principalClaim).to.equal(500n);
    expect(stats.totalShares).to.equal(500n);
    expect(stats.totalWeightedShares).to.equal(500n);
    expect(stats.saverPrincipalClaims).to.equal(500n);
    expect(stats.liquidPoolAssets).to.equal(500n);
    expect(stats.liquidityReserveTarget).to.equal(100n);
    expect(stats.availableLending).to.equal(400n);
    expect(await token.balanceOf(saverA.address)).to.equal(500n);
    const event = receipt?.logs.map((log) => {
      try { return pool.interface.parseLog(log); } catch { return null; }
    }).find((log) => log?.name === "Deposited");
    expect(event?.args.saver).to.equal(saverA.address);
    expect(event?.args.amount).to.equal(500n);
  });

  it("keeps multiple Saver shares proportional and weighted totals exact", async function () {
    const { saverA, saverB, pool } = await deployPool();
    await (await pool.setIdentityVerification(saverA.address, true)).wait();
    await (await pool.setIdentityVerification(saverB.address, true)).wait();
    await (await pool.connect(saverA).deposit(300n)).wait();
    await (await pool.connect(saverB).deposit(200n)).wait();
    await (await pool.connect(saverA).deposit(100n)).wait();
    const a = await pool.getSaverPosition(saverA.address);
    const b = await pool.getSaverPosition(saverB.address);
    const stats = await pool.getPoolStats();
    expect(a.shares).to.equal(400n);
    expect(b.shares).to.equal(200n);
    expect(a.principalClaim).to.equal(400n);
    expect(b.principalClaim).to.equal(200n);
    expect(a.shares + b.shares).to.equal(stats.totalShares);
    expect(a.weightedShares + b.weightedShares).to.equal(stats.totalWeightedShares);
    expect(stats.saverPrincipalClaims).to.equal(600n);
    expect(stats.liquidityReserveTarget).to.equal(120n);
    expect(stats.availableLending).to.equal(480n);
  });

  it("calculates the liquidity reserve target from aggregate principal", async function () {
    const { saverA, pool } = await deployPool();
    await (await pool.setIdentityVerification(saverA.address, true)).wait();
    for (let i = 0; i < 5; i += 1) await (await pool.connect(saverA).deposit(1n)).wait();
    expect(await pool.totalShares()).to.equal(5n);
    expect(await pool.liquidityReserveTarget()).to.equal(1n);
    expect(await pool.availableLending()).to.equal(4n);
  });

  it("allows only admin to update reserve BPS and recalculates target without altering claims", async function () {
    const { saverA, saverB, token, pool } = await deployPool();
    await (await pool.setIdentityVerification(saverA.address, true)).wait();
    await (await pool.connect(saverA).deposit(100n)).wait();
    await assert.rejects(pool.connect(saverB).setReserveBps(3_000), /OwnableUnauthorizedAccount/);
    await assert.rejects(pool.setReserveBps(10_001), /InvalidReserveRatio/);
    const receipt = await (await pool.setReserveBps(3_000)).wait();
    expect(await pool.reserveBps()).to.equal(3_000n);
    expect(await pool.liquidityReserveTarget()).to.equal(30n);
    expect(await pool.availableLending()).to.equal(70n);
    expect((await pool.getSaverPosition(saverA.address)).principalClaim).to.equal(100n);
    expect(await token.balanceOf(await pool.getAddress())).to.equal(100n);
    const event = receipt?.logs.map((log) => {
      try { return pool.interface.parseLog(log); } catch { return null; }
    }).find((log) => log?.name === "ReserveBpsUpdated");
    expect(event?.args.oldReserveBps).to.equal(2_000n);
    expect(event?.args.newReserveBps).to.equal(3_000n);
  });

  it("accepts reserve BPS boundaries and applies the current ratio to later deposits", async function () {
    const { saverA, pool } = await deployPool();
    await (await pool.setIdentityVerification(saverA.address, true)).wait();
    await (await pool.setReserveBps(0)).wait();
    await (await pool.connect(saverA).deposit(100n)).wait();
    expect(await pool.liquidityReserveTarget()).to.equal(0n);
    await (await pool.setReserveBps(10_000)).wait();
    expect(await pool.liquidityReserveTarget()).to.equal(100n);
    expect(await pool.availableLending()).to.equal(0n);
    await (await pool.connect(saverA).deposit(50n)).wait();
    expect(await pool.liquidityReserveTarget()).to.equal(150n);
    expect(await pool.totalShares()).to.equal(150n);
  });

  it("rolls back share accounting when token approval is insufficient", async function () {
    const { saverA, token, pool } = await deployPool();
    await (await pool.setIdentityVerification(saverA.address, true)).wait();
    await (await token.connect(saverA).approve(await pool.getAddress(), 10n)).wait();
    await assert.rejects(pool.connect(saverA).deposit(100n));
    expect((await pool.getSaverPosition(saverA.address)).shares).to.equal(0n);
    expect(await pool.totalShares()).to.equal(0n);
    expect(await pool.totalWeightedShares()).to.equal(0n);
    expect(await pool.saverPrincipalClaims()).to.equal(0n);
    expect(await pool.liquidityReserveTarget()).to.equal(0n);
    expect(await token.balanceOf(await pool.getAddress())).to.equal(0n);
  });

  it("does not give Saver shares for direct token donations", async function () {
    const { saverA, saverB, token, pool } = await deployPool();
    await (await token.connect(saverA).transfer(await pool.getAddress(), 100n)).wait();
    expect(await pool.totalShares()).to.equal(0n);
    await (await pool.setIdentityVerification(saverB.address, true)).wait();
    await (await pool.connect(saverB).deposit(100n)).wait();
    expect((await pool.getSaverPosition(saverB.address)).shares).to.equal(100n);
    expect(await pool.saverPrincipalClaims()).to.equal(100n);
    expect(await token.balanceOf(await pool.getAddress())).to.equal(200n);
  });

  it("rejects fee-on-transfer tokens without leaving partial accounting", async function () {
    const [, saver] = await ethers.getSigners();
    const token = await ethers.deployContract("FeeOnTransferMock");
    const pool = await ethers.deployContract("LoanchPool", [await token.getAddress(), 2_000]);
    await (await token.mint(saver.address, 100n)).wait();
    await (await token.connect(saver).approve(await pool.getAddress(), 100n)).wait();
    await (await pool.setIdentityVerification(saver.address, true)).wait();
    await assert.rejects(pool.connect(saver).deposit(100n), /UnsupportedTokenTransfer/);
    expect(await pool.totalShares()).to.equal(0n);
    expect(await pool.saverPrincipalClaims()).to.equal(0n);
    expect(await token.balanceOf(await pool.getAddress())).to.equal(0n);
    expect(await token.balanceOf(saver.address)).to.equal(100n);
  });

  it("updates weighted share totals and validates admin weight bounds", async function () {
    const { saverA, saverB, pool } = await deployPool();
    await (await pool.setIdentityVerification(saverA.address, true)).wait();
    await (await pool.setIdentityVerification(saverB.address, true)).wait();
    await (await pool.connect(saverA).deposit(100n)).wait();
    await (await pool.connect(saverB).deposit(100n)).wait();
    await assert.rejects(pool.connect(saverB).setSaverWeight(saverA.address, 20_000), /OwnableUnauthorizedAccount/);
    await assert.rejects(pool.setSaverWeight(saverA.address, 4_999), /InvalidWeight/);
    await assert.rejects(pool.setSaverWeight(saverA.address, 20_001), /InvalidWeight/);
    await (await pool.setSaverWeight(saverA.address, 5_000)).wait();
    await (await pool.setSaverWeight(saverB.address, 20_000)).wait();
    expect((await pool.getSaverPosition(saverA.address)).weightedShares).to.equal(50n);
    expect((await pool.getSaverPosition(saverB.address)).weightedShares).to.equal(200n);
    expect(await pool.totalWeightedShares()).to.equal(250n);
    await (await pool.connect(saverA).deposit(10n)).wait();
    expect((await pool.getSaverPosition(saverA.address)).weightedShares).to.equal(55n);
    expect(await pool.totalWeightedShares()).to.equal(255n);
  });

  it("rejects a subunit weighted position before accepting tokens", async function () {
    const { saverA, token, pool } = await deployPool();
    await (await pool.setIdentityVerification(saverA.address, true)).wait();
    await (await pool.setSaverWeight(saverA.address, 5_000)).wait();
    await assert.rejects(pool.connect(saverA).deposit(1n), /ZeroWeightedShares/);
    expect(await token.balanceOf(await pool.getAddress())).to.equal(0n);
    expect(await pool.totalShares()).to.equal(0n);
  });
});
