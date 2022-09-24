const { network } = require("hardhat")
const { developmentChains, INITIAL_SUPPLY } = require("../helper-hardhat-config")
const { verify } = require("../utils/verify")

module.exports = async ({ getNamedAccounts, deployments }) => {
    const { deploy, log } = deployments
    const { deployer } = await getNamedAccounts()

    // deploy TestToken
    const TestToken = await deploy("TestToken", {
        from: deployer,
        args: [INITIAL_SUPPLY],
        log: true,
        waitConfirmations: network.config.blockConfirmations || 1, // will need to wait if on testnet so we can verify properly
    })
    log(`TestToken deployed at ${TestToken.address}!`)

    // verify contract
    if (!developmentChains.includes(network.name) && process.env.ETHERSCAN_API_KEY) {
        await verify(TestToken.address, [INITIAL_SUPPLY])
    }
    log("Contract is verified!")
}

module.exports.tags = ["all", "TestToken"]
