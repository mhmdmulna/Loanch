import assert from "node:assert/strict";
import { expect } from "chai";
import { deployFixture, ethers } from "./fixture.ts";

describe("LoanchPool security and accounting", function () {
  it("blocks token callback reentrancy on incoming and outgoing transfers", async function () {
    const [, saver, borrower] = await ethers.getSigners();
    const token = await ethers.deployContract("ReentrantToken");
    const pool = await ethers.deployContract("LoanchPool", [await token.getAddress(), 2_000]);
    await (await token.setPool(await pool.getAddress())).wait();
    await (await token.mint(saver.address, 100n)).wait();
    await (await token.mint(borrower.address, 100n)).wait();
    await (await token.connect(saver).approve(await pool.getAddress(), 100n)).wait();
    await (await token.connect(borrower).approve(await pool.getAddress(), 100n)).wait();
    await (await pool.setIdentityVerification(saver.address, true)).wait();
    await (await pool.setIdentityVerification(borrower.address, true)).wait();
    await (await pool.setBorrowerRiskScore(borrower.address, 80)).wait();
    await (await pool.connect(saver).deposit(100n)).wait();
    expect(await token.reentryBlocked()).to.equal(true);
    expect(await token.reentrySelector()).to.equal(pool.interface.getError("ReentrancyGuardReentrantCall")?.selector);
    expect(await pool.totalShares()).to.equal(100n);
    await (await pool.connect(borrower).stake(3n)).wait();
    await (await pool.connect(borrower).requestLoan(50n, 86400n)).wait();
    expect(await pool.loanCount()).to.equal(1n);
    expect(await token.reentrySelector()).to.equal(pool.interface.getError("ReentrancyGuardReentrantCall")?.selector);
    await (await pool.connect(borrower).repayLoan(1n, 55n)).wait();
    await (await pool.connect(saver).withdraw(100n)).wait();
    expect(await pool.totalShares()).to.equal(0n);
    expect(await token.balanceOf(saver.address)).to.equal(100n);
  });

  it("never uses active loan funds or segregated liabilities for Saver withdrawal", async function () {
    const { pool, saverA, borrower } = await deployFixture();
    for (const user of [saverA, borrower]) await (await pool.setIdentityVerification(user.address, true)).wait();
    await (await pool.setBorrowerRiskScore(borrower.address, 80)).wait();
    await (await pool.connect(saverA).deposit(1_000n)).wait();
    await (await pool.connect(borrower).stake(25n)).wait();
    await (await pool.connect(borrower).requestLoan(500n, 86400n)).wait();
    await assert.rejects(pool.connect(saverA).withdraw(501n), /InsufficientLiquidity/);
    expect((await pool.getSaverPosition(saverA.address)).shares).to.equal(1_000n);
    expect(await pool.withdrawablePrincipal(saverA.address)).to.equal(500n);
    await (await pool.connect(borrower).repayLoan(1n, 550n)).wait();
    await (await pool.connect(saverA).withdraw(1_000n)).wait();
    expect(await pool.saverPrincipalClaims()).to.equal(0n);
    expect(await pool.saverReturnLiability()).to.equal(40n);
    expect(await pool.platformRevenue()).to.equal(7n);
    expect(await pool.lossReserveAmount()).to.equal(3n);
    await (await pool.connect(saverA).claimReturn()).wait();
  });

  it("only lets the owner withdraw earned platform revenue", async function () {
    const { pool, saverA, borrower, other, token } = await deployFixture();
    for (const user of [saverA, borrower]) await (await pool.setIdentityVerification(user.address, true)).wait();
    await (await pool.setBorrowerRiskScore(borrower.address, 80)).wait();
    await (await pool.connect(saverA).deposit(2_000n)).wait();
    await (await pool.connect(borrower).stake(50n)).wait();
    await (await pool.connect(borrower).requestLoan(1_000n, 86400n)).wait();
    await (await pool.connect(borrower).repayLoan(1n, 1_100n)).wait();
    await assert.rejects(pool.connect(other).withdrawPlatformRevenue(other.address, 1n), /OwnableUnauthorizedAccount/);
    await assert.rejects(pool.withdrawPlatformRevenue(other.address, 16n), /InsufficientPlatformRevenue/);
    const before = await token.balanceOf(other.address);
    await (await pool.withdrawPlatformRevenue(other.address, 15n)).wait();
    expect(await token.balanceOf(other.address)).to.equal(before + 15n);
    expect(await pool.platformRevenue()).to.equal(0n);
  });
});
