/**
 * Local demo provisioning. Use token amounts as decimal strings so large values
 * stay exact. Every customer address must be an unlocked account on the local
 * Hardhat node; never put private keys in this file.
 */
export const DEMO_POOL = {
  minimumLiquidityProviderDepositTokens: "1000",
  liquidityProviderAccountIndex: 2,
};

export const DEMO_CUSTOMERS = [
  {
    address: "0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266",
    riskScore: 100,
    depositPositionTokens: "1000",
    freeStakeTokens: "500",
    sampleLoanTokens: "100",
    sampleLoanDurationDays: 30,
  },

  {
    address: "0x14dC79964da2C08b23698B3D3cc7Ca32193d9955",
    riskScore: 100,
    depositPositionTokens: "100",
    freeStakeTokens: "50",
    sampleLoanTokens: "10",
    sampleLoanDurationDays: 30,
  },
];
