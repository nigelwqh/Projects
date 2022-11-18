const { ethers } = require("hardhat");

async function main() {
  /*
  A ContractFactory in ethers.js is an abstraction used to deploy new smart contracts,
  so whitelistContract here is a factory for instances of our Whitelist contract.
  */
  const whitelistContract = await ethers.getContractFactory("Whitelist");

  // deploy contract
  // 10 is the maximum number of whitelisted addresses allowed as per required by the constructor
  const deployedWhitelistContract = await whitelistContract.deploy(10);

  // wait for contract to finish deploying
  await deployedWhitelistContract.deployed();

  console.log(
    `Whitelist contract address: ${deployedWhitelistContract.address}`
  );
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
