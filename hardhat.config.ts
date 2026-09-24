import "dotenv/config"
import hardhatEthers from "@nomicfoundation/hardhat-ethers"
import hardhatMocha from "@nomicfoundation/hardhat-mocha"
import hardhatTypechain from "@nomicfoundation/hardhat-typechain"
import { defineConfig } from "hardhat/config"

export default defineConfig({
  plugins: [hardhatEthers, hardhatMocha, hardhatTypechain],
  networks: {
    localhost: { type: "http", url: "http://127.0.0.1:8545" },
    botTestnet: {
      type: "http",
      url: process.env.BOT_CHAIN_RPC_URL ?? "https://rpc.bohr.life",
      chainId: Number(process.env.BOT_CHAIN_CHAIN_ID ?? "968"),
      accounts: process.env.DEPLOYER_PRIVATE_KEY ? [process.env.DEPLOYER_PRIVATE_KEY] : [],
    },
  },
  solidity: {
    version: "0.8.28",
    settings: {
      optimizer: {
        enabled: true,
        runs: 200,
      },
    },
  },
})
