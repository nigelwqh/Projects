const { ethers } = require("hardhat");
const { CRYPTO_DEVS_NFT_CONTRACT_ADDRESS } = require("../constants");

const main = async () => {
  // Deploy the FakeNFTMarketplace contract first
  const FakeNFTMarketplace = await ethers.getContractFactory(
    "FakeNFTMarketplace"
  );
  const fakeNFTMarketplace = await FakeNFTMarketplace.deploy();
  await fakeNFTMarketplace.deployed();

  console.log(
    `FakeNFTMarketplace contract deployed to: ${fakeNFTMarketplace.address}`
  );

  // Now deploy the CryptoDevsDAO contract
  const CryptoDevsDAO = await ethers.getContractFactory("CryptoDevsDAO");
  const cryptoDevsDAO = await CryptoDevsDAO.deploy(
    fakeNFTMarketplace.address,
    CRYPTO_DEVS_NFT_CONTRACT_ADDRESS,
    { value: ethers.utils.parseEther("0.05") }
  );
  await cryptoDevsDAO.deployed();

  console.log(`CryptoDevsDAO contract deployed to: ${cryptoDevsDAO.address}`);
};

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });

// FakeNFTMarketplace contract deployed to: 0x0b022e523D4306c0fE4eccE3dFC8168bdbf62aCe
// CryptoDevsDAO contract deployed to: 0x4597796Eb14E671221610508e582CC6D2BD7c662
