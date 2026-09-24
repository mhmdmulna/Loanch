import assert from "node:assert/strict";
import { expect } from "chai";
import { deployFixture } from "./fixture.ts";

describe("LoanchPool configuration", function () {
  it("keeps identity shared and risk separate for the same wallet", async function () {
    const { pool, saverA } = await deployFixture();
    await (await pool.setIdentityVerification(saverA.address, true)).wait();
    expect(await pool.identityVerified(saverA.address)).to.equal(true);
    expect((await pool.getBorrowerProfile(saverA.address)).reputation).to.equal(50n);
    expect((await pool.getBorrowerProfile(saverA.address)).riskScore).to.equal(0n);
    await (await pool.setBorrowerRiskScore(saverA.address, 82)).wait();
    expect((await pool.getBorrowerProfile(saverA.address)).riskScore).to.equal(82n);
  });

  it("restricts risk and distribution changes to owner and validates ranges", async function () {
    const { pool, saverA } = await deployFixture();
    await assert.rejects(pool.connect(saverA).setBorrowerRiskScore(saverA.address, 80), /OwnableUnauthorizedAccount/);
    await assert.rejects(pool.connect(saverA).setRiskThreshold(40), /OwnableUnauthorizedAccount/);
    await assert.rejects(pool.connect(saverA).setDistributionBps(8000, 1500, 500), /OwnableUnauthorizedAccount/);
    await assert.rejects(pool.setBorrowerRiskScore(saverA.address, 101), /InvalidScore/);
    await assert.rejects(pool.setRiskThreshold(101), /InvalidScore/);
    await assert.rejects(pool.setDistributionBps(8000, 1500, 499), /InvalidDistribution/);
    await (await pool.setRiskThreshold(75)).wait();
    await (await pool.setDistributionBps(7000, 2000, 1000)).wait();
    expect(await pool.riskThreshold()).to.equal(75n);
    expect(await pool.saverBps()).to.equal(7000n);
    expect(await pool.platformBps()).to.equal(2000n);
    expect(await pool.reserveReturnBps()).to.equal(1000n);
  });
});
