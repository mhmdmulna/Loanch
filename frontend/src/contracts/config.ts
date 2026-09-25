const mainnetDefaults = {
  rpcUrl: 'https://rpc.botchain.ai',
  chainId: '677',
  chainName: 'BOT Chain Mainnet',
  explorerUrl: 'https://scan.botchain.ai',
} as const

export const botChainConfig = {
  rpcUrl: import.meta.env.VITE_BOT_CHAIN_RPC_URL?.trim() || mainnetDefaults.rpcUrl,
  chainId: import.meta.env.VITE_BOT_CHAIN_CHAIN_ID?.trim() || mainnetDefaults.chainId,
  chainName: import.meta.env.VITE_BOT_CHAIN_NAME?.trim() || mainnetDefaults.chainName,
  explorerUrl: import.meta.env.VITE_BOT_CHAIN_EXPLORER_URL?.trim() || mainnetDefaults.explorerUrl,
  nativeCurrency: {
    name: 'BOT',
    symbol: 'BOT',
    decimals: 18,
  },
} as const
