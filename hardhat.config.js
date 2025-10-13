import "@nomicfoundation/hardhat-toolbox";
import "dotenv/config";

const { VALORCHAIN_G_RPC_URL, PRIVATE_KEY } = process.env;

/** @type import('hardhat/config').HardhatUserConfig */
export default {
  solidity: "0.8.20",
  networks: {
    hardhat: {},
    valorchain_g: {
      url: VALORCHAIN_G_RPC_URL || "",
      accounts: PRIVATE_KEY ? [`0x${PRIVATE_KEY}`] : [],
    },
  }
};