import assert from "node:assert/strict";
import { expect } from "chai";
import hre from "hardhat";

const { ethers } = await hre.network.create();

describe("LoanchPool deposits", function () {
  async function deployPool(reserveBps = 2_000) {
    const [owner, saverA, saverB] = await ethers.getSigners();
    const pool = await ethers.deployContract("LoanchPool", [reserveBps]);
    return { owner, saverA, saverB, pool };
  }

  it("deploys for native BOT and rejects an initial reserve ratio above 100%", async function () {
    const pool = await ethers.deployContract("LoanchPool", [2_000]);
    expect(await pool.reserveBps()).to.equal(2_000n);
    await assert.rejects(ethers.deployContract("LoanchPool", [10_001]), /InvalidReserveRatio/);
  });

  it("allows an unverified wallet to deposit in demo mode", async function () {
    const { saverA, pool } = await deployPool();
    await (await pool.connect(saverA).deposit({ value: 100n })).wait();
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
    await (await pool.connect(saverA).deposit({ value: 100n })).wait();
    await (await pool.setIdentityVerification(saverA.address, false)).wait();
    await (await pool.connect(saverA).deposit({ value: 1n })).wait();
    expect((await pool.getSaverPosition(saverA.address)).shares).to.equal(101n);
  });

  it("rejects a zero deposit without moving BOT or minting shares", async function () {
    const { saverA, pool } = await deployPool();
    await (await pool.setIdentityVerification(saverA.address, true)).wait();
    await assert.rejects(pool.connect(saverA).deposit({ value: 0n }), /ZeroDeposit/);
    expect(await pool.totalShares()).to.equal(0n);
    expect(await pool.saverPrincipalClaims()).to.equal(0n);
    expect(await ethers.provider.getBalance(await pool.getAddress())).to.equal(0n);
  });

  it("mints shares 1:1 initially and gives a new Saver weight of 1x", async function () {
    const { saverA, pool } = await deployPool();
    await (await pool.setIdentityVerification(saverA.address, true)).wait();
    const receipt = await (await pool.connect(saverA).deposit({ value: 500n })).wait();
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
    expect(await ethers.provider.getBalance(await pool.getAddress())).to.equal(500n);
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
    await (await pool.connect(saverA).deposit({ value: 300n })).wait();
    await (await pool.connect(saverB).deposit({ value: 200n })).wait();
    await (await pool.connect(saverA).deposit({ value: 100n })).wait();
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
    for (let i = 0; i < 5; i += 1) await (await pool.connect(saverA).deposit({ value: 1n })).wait();
    expect(await pool.totalShares()).to.equal(5n);
    expect(await pool.liquidityReserveTarget()).to.equal(1n);
    expect(await pool.availableLending()).to.equal(4n);
  });

  it("allows only admin to update reserve BPS and recalculates target without altering claims", async function () {
    const { saverA, saverB, pool } = await deployPool();
    await (await pool.setIdentityVerification(saverA.address, true)).wait();
    await (await pool.connect(saverA).deposit({ value: 100n })).wait();
    await assert.rejects(pool.connect(saverB).setReserveBps(3_000), /OwnableUnauthorizedAccount/);
    await assert.rejects(pool.setReserveBps(10_001), /InvalidReserveRatio/);
    const receipt = await (await pool.setReserveBps(3_000)).wait();
    expect(await pool.reserveBps()).to.equal(3_000n);
    expect(await pool.liquidityReserveTarget()).to.equal(30n);
    expect(await pool.availableLending()).to.equal(70n);
    expect((await pool.getSaverPosition(saverA.address)).principalClaim).to.equal(100n);
    expect(await ethers.provider.getBalance(await pool.getAddress())).to.equal(100n);
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
    await (await pool.connect(saverA).deposit({ value: 100n })).wait();
    expect(await pool.liquidityReserveTarget()).to.equal(0n);
    await (await pool.setReserveBps(10_000)).wait();
    expect(await pool.liquidityReserveTarget()).to.equal(100n);
    expect(await pool.availableLending()).to.equal(0n);
    await (await pool.connect(saverA).deposit({ value: 50n })).wait();
    expect(await pool.liquidityReserveTarget()).to.equal(150n);
    expect(await pool.totalShares()).to.equal(150n);
  });

  it("rejects direct BOT transfers so every inbound payment is accounted", async function () {
    const { saverA, pool } = await deployPool();
    await assert.rejects(saverA.sendTransaction({ to: await pool.getAddress(), value: 100n }), /DirectPaymentUnsupported/);
    expect(await pool.totalShares()).to.equal(0n);
    expect(await pool.saverPrincipalClaims()).to.equal(0n);
    expect(await ethers.provider.getBalance(await pool.getAddress())).to.equal(0n);
  });

  it("updates weighted share totals and validates admin weight bounds", async function () {
    const { saverA, saverB, pool } = await deployPool();
    await (await pool.setIdentityVerification(saverA.address, true)).wait();
    await (await pool.setIdentityVerification(saverB.address, true)).wait();
    await (await pool.connect(saverA).deposit({ value: 100n })).wait();
    await (await pool.connect(saverB).deposit({ value: 100n })).wait();
    await assert.rejects(pool.connect(saverB).setSaverWeight(saverA.address, 20_000), /OwnableUnauthorizedAccount/);
    await assert.rejects(pool.setSaverWeight(saverA.address, 4_999), /InvalidWeight/);
    await assert.rejects(pool.setSaverWeight(saverA.address, 20_001), /InvalidWeight/);
    await (await pool.setSaverWeight(saverA.address, 5_000)).wait();
    await (await pool.setSaverWeight(saverB.address, 20_000)).wait();
    expect((await pool.getSaverPosition(saverA.address)).weightedShares).to.equal(50n);
    expect((await pool.getSaverPosition(saverB.address)).weightedShares).to.equal(200n);
    expect(await pool.totalWeightedShares()).to.equal(250n);
    await (await pool.connect(saverA).deposit({ value: 10n })).wait();
    expect((await pool.getSaverPosition(saverA.address)).weightedShares).to.equal(55n);
    expect(await pool.totalWeightedShares()).to.equal(255n);
  });

  it("rejects a subunit weighted position before accepting BOT", async function () {
    const { saverA, pool } = await deployPool();
    await (await pool.setIdentityVerification(saverA.address, true)).wait();
    await (await pool.setSaverWeight(saverA.address, 5_000)).wait();
    await assert.rejects(pool.connect(saverA).deposit({ value: 1n }), /ZeroWeightedShares/);
    expect(await ethers.provider.getBalance(await pool.getAddress())).to.equal(0n);
    expect(await pool.totalShares()).to.equal(0n);
  });
});
