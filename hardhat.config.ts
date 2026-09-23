import "dotenv/config"
import hardhatEthers from "@nomicfoundation/hardhat-ethers"
import hardhatMocha from "@nomicfoundation/hardhat-mocha"
import { defineConfig } from "hardhat/config"

export default defineConfig({
  plugins: [hardhatEthers, hardhatMocha],
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
