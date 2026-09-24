import assert from "node:assert/strict";
import { expect } from "chai";
import { deployFixture, ethers } from "./fixture.ts";

describe("LoanchPool security and accounting", function () {
  it("blocks native BOT callback reentrancy on outgoing transfers", async function () {
    const pool = await ethers.deployContract("LoanchPool", [2_000]);
    const receiver = await ethers.deployContract("NativeReentrantReceiver", [await pool.getAddress()]);
    await (await receiver.deposit({ value: 100n })).wait();
    await (await receiver.withdrawWithAttack(100n)).wait();
    expect(await receiver.reentryBlocked()).to.equal(true);
    expect(await receiver.reentrySelector()).to.equal(pool.interface.getError("ReentrancyGuardReentrantCall")?.selector);
    expect(await pool.totalShares()).to.equal(0n);
    expect(await ethers.provider.getBalance(await receiver.getAddress())).to.equal(100n);
  });

  it("never uses active loan funds or segregated liabilities for Saver withdrawal", async function () {
    const { pool, saverA, borrower } = await deployFixture();
    for (const user of [saverA, borrower]) await (await pool.setIdentityVerification(user.address, true)).wait();
    await (await pool.setBorrowerRiskScore(borrower.address, 80)).wait();
    await (await pool.connect(saverA).deposit({ value: 1_000n })).wait();
    await (await pool.connect(borrower).stake({ value: 25n })).wait();
    await (await pool.connect(borrower).requestLoan(500n, 86400n)).wait();
    await assert.rejects(pool.connect(saverA).withdraw(501n), /InsufficientLiquidity/);
    expect((await pool.getSaverPosition(saverA.address)).shares).to.equal(1_000n);
    expect(await pool.withdrawablePrincipal(saverA.address)).to.equal(500n);
    await (await pool.connect(borrower).repayLoan(1n, { value: 550n })).wait();
    await (await pool.connect(saverA).withdraw(1_000n)).wait();
    expect(await pool.saverPrincipalClaims()).to.equal(0n);
    expect(await pool.saverReturnLiability()).to.equal(40n);
    expect(await pool.platformRevenue()).to.equal(7n);
    expect(await pool.lossReserveAmount()).to.equal(3n);
    await (await pool.connect(saverA).claimReturn()).wait();
  });

  it("only lets the owner withdraw earned platform revenue", async function () {
    const { pool, saverA, borrower, other } = await deployFixture();
    for (const user of [saverA, borrower]) await (await pool.setIdentityVerification(user.address, true)).wait();
    await (await pool.setBorrowerRiskScore(borrower.address, 80)).wait();
    await (await pool.connect(saverA).deposit({ value: 2_000n })).wait();
    await (await pool.connect(borrower).stake({ value: 50n })).wait();
    await (await pool.connect(borrower).requestLoan(1_000n, 86400n)).wait();
    await (await pool.connect(borrower).repayLoan(1n, { value: 1_100n })).wait();
    await assert.rejects(pool.connect(other).withdrawPlatformRevenue(other.address, 1n), /OwnableUnauthorizedAccount/);
    await assert.rejects(pool.withdrawPlatformRevenue(other.address, 16n), /InsufficientPlatformRevenue/);
    const before = await ethers.provider.getBalance(other.address);
    await (await pool.withdrawPlatformRevenue(other.address, 15n)).wait();
    expect(await ethers.provider.getBalance(other.address)).to.equal(before + 15n);
    expect(await pool.platformRevenue()).to.equal(0n);
  });
});
