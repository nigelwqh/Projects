require("@nomicfoundation/hardhat-toolbox");
require("dotenv").config({ path: ".env" });

ALCHEMY_RPC_URL = process.env.ALCHEMY_RPC_URL;
PRIVATE_KEY = process.env.PRIVATE_KEY;

module.exports = {
  solidity: "0.8.4",
  networks: {
    goerli: {
      url: ALCHEMY_RPC_URL,
      accounts: [PRIVATE_KEY],
    },
  },
};
