import "dotenv/config"
import hardhatEthers from "@nomicfoundation/hardhat-ethers"
import hardhatMocha from "@nomicfoundation/hardhat-mocha"
import hardhatTypechain from "@nomicfoundation/hardhat-typechain"
import { defineConfig } from "hardhat/config"

export default defineConfig({
  plugins: [hardhatEthers, hardhatMocha, hardhatTypechain],
  networks: {
    localhost: { type: "http", url: "http://127.0.0.1:8545" },
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
