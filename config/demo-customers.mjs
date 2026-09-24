/**
 * Local demo provisioning. Use token amounts as decimal strings so large values
 * stay exact. Every customer address must be an unlocked account on the local
 * Hardhat node; never put private keys in this file.
 */
export const DEMO_POOL = {
  minimumLiquidityProviderDepositTokens: "500000",
  liquidityProviderAccountIndex: 2,
};

export const DEMO_CUSTOMERS = [
  {
    address: "0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266",
    riskScore: 100,
    depositPositionTokens: "10000",
    freeStakeTokens: "50000",
    sampleLoanTokens: "10000",
    sampleLoanDurationDays: 30,
  },
];
