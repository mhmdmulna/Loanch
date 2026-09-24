import assert from "node:assert/strict";
import { expect } from "chai";
import { deployFixture } from "./fixture.ts";

describe("LoanchPool Saver withdrawals", function () {
  it("withdraws principal partially then fully and burns shares", async function () {
    const { pool, token, saverA } = await deployFixture();
    await (await pool.setIdentityVerification(saverA.address, true)).wait();
    await (await pool.connect(saverA).deposit(1_000n)).wait();
    await (await pool.connect(saverA).withdraw(400n)).wait();
    expect((await pool.getSaverPosition(saverA.address)).shares).to.equal(600n);
    expect(await pool.totalWeightedShares()).to.equal(600n);
    expect(await pool.liquidityReserveTarget()).to.equal(120n);
    await (await pool.connect(saverA).withdraw(600n)).wait();
    expect((await pool.getSaverPosition(saverA.address)).shares).to.equal(0n);
    expect(await pool.totalShares()).to.equal(0n);
    expect(await pool.totalWeightedShares()).to.equal(0n);
    expect(await pool.saverPrincipalClaims()).to.equal(0n);
    expect(await token.balanceOf(await pool.getAddress())).to.equal(0n);
    await assert.rejects(pool.connect(saverA).withdraw(1n), /InsufficientPrincipal/);
  });

  it("reverts an overclaim or zero withdrawal without changing accounting", async function () {
    const { pool, saverA } = await deployFixture();
    await (await pool.setIdentityVerification(saverA.address, true)).wait();
    await (await pool.connect(saverA).deposit(100n)).wait();
    await assert.rejects(pool.connect(saverA).withdraw(0n), /ZeroAmount/);
    await assert.rejects(pool.connect(saverA).withdraw(101n), /InsufficientPrincipal/);
    expect((await pool.getSaverPosition(saverA.address)).shares).to.equal(100n);
    expect(await pool.saverPrincipalClaims()).to.equal(100n);
  });
});
