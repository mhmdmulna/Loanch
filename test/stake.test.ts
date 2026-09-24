import assert from "node:assert/strict";
import { expect } from "chai";
import { deployFixture, ethers } from "./fixture.ts";

describe("LoanchPool stake and eligibility", function () {
  it("keeps stake separate from pool and from a same-wallet Saver deposit", async function () {
    const { pool, borrower } = await deployFixture();
    await (await pool.connect(borrower).deposit({ value: 1_000n })).wait();
    expect(await pool.availableLending()).to.equal(800n);
    await (await pool.connect(borrower).stake({ value: 200n })).wait();
    expect(await pool.freeStake(borrower.address)).to.equal(200n);
    expect(await pool.totalLockedStake()).to.equal(200n);
    expect(await ethers.provider.getBalance(await pool.getAddress())).to.equal(1_200n);
    expect(await pool.liquidPoolAssets()).to.equal(1_000n);
    expect(await pool.availableLending()).to.equal(800n);
    await (await pool.connect(borrower).unstake(75n)).wait();
    expect(await pool.freeStake(borrower.address)).to.equal(125n);
    expect(await pool.availableLending()).to.equal(800n);
    await assert.rejects(pool.connect(borrower).unstake(126n), /InsufficientStake/);
    await assert.rejects(pool.connect(borrower).stake({ value: 0n }), /ZeroAmount/);
  });

  it("previews all baseline borrower requirements deterministically", async function () {
    const { pool, saverA, borrower } = await deployFixture();
    const duration = 30n * 86400n;
    expect((await pool.previewLoan(borrower.address, 100n, duration))[0]).to.equal(2n);
    await (await pool.setBorrowerRiskScore(borrower.address, 80)).wait();
    expect((await pool.previewLoan(borrower.address, 100n, duration))[0]).to.equal(5n);
    await (await pool.connect(saverA).deposit({ value: 1_000n })).wait();
    expect((await pool.previewLoan(borrower.address, 100n, duration))[0]).to.equal(8n);
    await (await pool.connect(borrower).stake({ value: 5n })).wait();
    expect((await pool.getBorrowerProfile(borrower.address)).reputation).to.equal(50n);
    expect(await pool.requiredStake(101n)).to.equal(6n);
    expect((await pool.previewLoan(borrower.address, 100n, duration))[0]).to.equal(0n);
    expect((await pool.previewLoan(borrower.address, 501n, duration))[0]).to.equal(5n);
    expect((await pool.previewLoan(borrower.address, 100n, 0n))[0]).to.equal(6n);
  });
});
