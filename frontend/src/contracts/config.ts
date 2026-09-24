export const botChainConfig = {
  rpcUrl: import.meta.env.VITE_BOT_CHAIN_RPC_URL,
  chainId: import.meta.env.VITE_BOT_CHAIN_CHAIN_ID,
  explorerUrl: import.meta.env.VITE_BOT_CHAIN_EXPLORER_URL,
} as const
