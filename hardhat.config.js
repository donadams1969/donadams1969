require('dotenv').config();
require('@nomicfoundation/hardhat-toolbox');
require('./tasks/deployAndPin');

const { RPC_URL_SEPOLIA, PRIVATE_KEY } = process.env;

module.exports = {
  solidity: {
    version: "0.8.24",
    settings: {
      optimizer: { enabled: true, runs: 2000 }
    }
  },
  networks: {
    sepolia: {
      url: RPC_URL_SEPOLIA || "",
      accounts: PRIVATE_KEY ? [PRIVATE_KEY] : []
    }
  }
};
