import assert from "node:assert/strict";
import { expect } from "chai";
import { deployFixture } from "./fixture.ts";

describe("LoanchPool loan creation", function () {
  it("allocates stake and disburses once after eligibility succeeds", async function () {
    const { pool, token, saverA, borrower } = await deployFixture();
    await (await pool.setBorrowerRiskScore(borrower.address, 80)).wait();
    await (await pool.connect(saverA).deposit(1_000n)).wait();
    await (await pool.connect(borrower).stake(50n)).wait();
    const borrowerBefore = await token.balanceOf(borrower.address);
    await (await pool.connect(borrower).requestLoan(400n, 30n * 86400n)).wait();
    expect(await pool.identityVerified(borrower.address)).to.equal(false);
    const loan = await pool.getLoan(1n);
    expect(loan.borrower).to.equal(borrower.address);
    expect(loan.principal).to.equal(400n);
    expect(loan.principalOutstanding).to.equal(400n);
    expect(loan.totalRepayment).to.equal(440n);
    expect(loan.stakeAmount).to.equal(20n);
    expect(loan.status).to.equal(1n);
    expect(await token.balanceOf(borrower.address)).to.equal(borrowerBefore + 400n);
    expect(await pool.freeStake(borrower.address)).to.equal(30n);
    expect(await pool.allocatedStake(borrower.address)).to.equal(20n);
    expect(await pool.activeLoanPrincipal()).to.equal(400n);
    expect(await pool.activeLoanCount()).to.equal(1n);
    expect(await pool.availableLending()).to.equal(400n);
    await assert.rejects(pool.connect(borrower).requestLoan(100n, 86400n), /LoanNotEligible/);
    await assert.rejects(pool.connect(borrower).unstake(31n), /InsufficientStake/);
    expect(await pool.loanCount()).to.equal(1n);
  });

  it("rejects insufficient liquidity despite valid identity, risk, and stake", async function () {
    const { pool, saverA, borrower } = await deployFixture();
    await (await pool.setIdentityVerification(saverA.address, true)).wait();
    await (await pool.setIdentityVerification(borrower.address, true)).wait();
    await (await pool.setBorrowerRiskScore(borrower.address, 80)).wait();
    await (await pool.connect(saverA).deposit(1_000n)).wait();
    await (await pool.connect(borrower).stake(25n)).wait();
    await (await pool.setReserveBps(9_000)).wait();
    expect((await pool.previewLoan(borrower.address, 500n, 86400n))[0]).to.equal(9n);
    await assert.rejects(pool.connect(borrower).requestLoan(500n, 86400n), /LoanNotEligible/);
    expect(await pool.loanCount()).to.equal(0n);
    expect(await pool.allocatedStake(borrower.address)).to.equal(0n);
  });
});
