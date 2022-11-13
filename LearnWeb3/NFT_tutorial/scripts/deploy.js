const { ethers } = require("hardhat");

const main = async () => {
  const nftContract = await ethers.getContractFactory("GameItem");

  // deploy the contract
  const deployedNFTContract = await nftContract.deploy();

  // wait for contract to deploy. This function will keep polling the blockchain until the contract has been successfully deployed.
  await deployedNFTContract.deployed();

  // print address of deployed contract
  console.log(`NFT Contract Address: ${deployedNFTContract.address}`);
};

// call main function and catch if any error
main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
