import assert from "node:assert/strict";
import { expect } from "chai";
import { deployFixture, ethers } from "./fixture.ts";

type Fixture = Awaited<ReturnType<typeof deployFixture>>;

async function assertAccounting(f: Fixture, saverAddresses: string[]) {
  const { pool } = f;
  const stats = await pool.getPoolStats();
  const balance = await ethers.provider.getBalance(await pool.getAddress());
  expect(stats.liquidPoolAssets + stats.lockedStake).to.equal(balance);
  assert.ok(stats.liquidPoolAssets + stats.activeLoanPrincipal >=
    stats.saverPrincipalClaims + stats.saverReturnLiability + stats.platformRevenue + stats.lossReserveAmount);
  let shares = 0n;
  let weightedShares = 0n;
  for (const address of saverAddresses) {
    const position = await pool.getSaverPosition(address);
    shares += position.shares;
    weightedShares += position.weightedShares;
  }
  expect(shares).to.equal(stats.totalShares);
  expect(weightedShares).to.equal(stats.totalWeightedShares);
  assert.ok(stats.availableLending <= stats.liquidPoolAssets);
}

describe("LoanchPool full-system invariants", function () {
  it("keeps liabilities solvent across unequal weights, withdrawal, policy changes and claims", async function () {
    const f = await deployFixture();
    const { pool, saverA, saverB, other, borrower } = f;
    const savers = [saverA.address, saverB.address, other.address];
    for (const user of [saverA, saverB, other, borrower]) await (await pool.setIdentityVerification(user.address, true)).wait();
    await (await pool.setBorrowerRiskScore(borrower.address, 80)).wait();
    await (await pool.connect(saverA).deposit({ value: 2_000n })).wait();
    await (await pool.connect(saverB).deposit({ value: 1_000n })).wait();
    await (await pool.connect(other).deposit({ value: 1_000n })).wait();
    await (await pool.setSaverWeight(saverA.address, 5_000)).wait();
    await (await pool.setSaverWeight(saverB.address, 20_000)).wait();
    await assertAccounting(f, savers);

    await (await pool.connect(borrower).stake({ value: 50n })).wait();
    await (await pool.connect(borrower).requestLoan(1_000n, 86400n)).wait();
    await assertAccounting(f, savers);
    await (await pool.connect(borrower).repayLoan(1n, { value: 1_050n })).wait();
    expect(await pool.claimableReturn(saverA.address)).to.equal(10n);
    expect(await pool.claimableReturn(saverB.address)).to.equal(20n);
    expect(await pool.claimableReturn(other.address)).to.equal(10n);
    await assertAccounting(f, savers);

    await (await pool.connect(other).withdraw(500n)).wait();
    await (await pool.setSaverWeight(saverA.address, 20_000)).wait();
    await (await pool.setSaverWeight(saverB.address, 5_000)).wait();
    await (await pool.setDistributionBps(6_000, 3_000, 1_000)).wait();
    await assertAccounting(f, savers);
    await (await pool.connect(borrower).repayLoan(1n, { value: 50n })).wait();
    expect(await pool.claimableReturn(saverA.address)).to.equal(34n);
    expect(await pool.claimableReturn(saverB.address)).to.equal(23n);
    expect(await pool.claimableReturn(other.address)).to.equal(13n);
    await assertAccounting(f, savers);

    for (const saver of [saverA, saverB, other]) {
      await (await pool.connect(saver).claimReturn()).wait();
      await assertAccounting(f, savers);
    }
    expect(await pool.saverReturnLiability()).to.equal(0n);
    await (await pool.withdrawPlatformRevenue(f.owner.address, 22n)).wait();
    await assertAccounting(f, savers);
  });

  it("preserves the accounting equation for 20 deterministic fuzz seeds", async function () {
    for (let seed = 1n; seed <= 20n; seed++) {
      const f = await deployFixture();
      const { pool, saverA, saverB, borrower } = f;
      const savers = [saverA.address, saverB.address];
      for (const user of [saverA, saverB, borrower]) await (await pool.setIdentityVerification(user.address, true)).wait();
      await (await pool.setBorrowerRiskScore(borrower.address, 80)).wait();
      await (await pool.connect(saverA).deposit({ value: 1_000n + seed * 7_919n % 500n })).wait();
      await (await pool.connect(saverB).deposit({ value: 700n + seed * 1_543n % 300n })).wait();
      await assertAccounting(f, savers);
      const principal = 300n + seed * 3_571n % 300n;
      await (await pool.connect(borrower).stake({ value: await pool.requiredStake(principal) })).wait();
      await (await pool.connect(borrower).requestLoan(principal, 86400n)).wait();
      await assertAccounting(f, savers);
      await (await pool.connect(borrower).repayLoan(1n, { value: principal / 2n })).wait();
      await assertAccounting(f, savers);
      if (seed % 2n === 0n) {
        await (await pool.connect(borrower).repayLoan(1n, { value: await pool.remainingDebt(1n) })).wait();
      } else {
        await ethers.provider.send("evm_increaseTime", [9 * 86400]);
        await ethers.provider.send("evm_mine", []);
        await (await pool.markDefault(1n)).wait();
      }
      await assertAccounting(f, savers);
    }
  });
});
