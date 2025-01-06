import "@typechain/hardhat";
import { HardhatUserConfig } from "hardhat/config";
import "@nomicfoundation/hardhat-toolbox";
import * as dotenv from 'dotenv';

// Load environment variables from .env file
dotenv.config();

const config: HardhatUserConfig = {
  solidity: "0.8.28",
  networks:{
    sepolia:{
      url: process.env.ALCHEMY_URL_API_KEY,
      accounts: [`0x${process.env.TESTNET_PRIAVTE_KEY}`],
    },
    // localhost: {
    //       url: "http://127.0.0.1:8545", // Local Hardhat Network
    //   },
  },
};

export default config;
