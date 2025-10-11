require("@nomicfoundation/hardhat-toolbox");
require("dotenv").config();

const { VALORCHAIN_G_RPC_URL, ETHEREUM_RPC_URL, PRIVATE_KEY } = process.env;

/** @type import('hardhat/config').HardhatUserConfig */
module.exports = {
  solidity: {
    version: "0.8.24",
    settings: {
      optimizer: {
        enabled: true,
        runs: 200,
      },
    },
  },
  networks: {
    hardhat: {
      // Default network for local testing
    },
    valorchain_g: {
      url: VALORCHAIN_G_RPC_URL || "",
      accounts: PRIVATE_KEY ? [`0x${PRIVATE_KEY}`] : [],
    },
    ethereum: {
      url: ETHEREUM_RPC_URL || "",
      accounts: PRIVATE_KEY ? [`0x${PRIVATE_KEY}`] : [],
    },
  },
  etherscan: {
    // No API key needed for local testing
  },
};