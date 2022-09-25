const { network, ethers } = require("hardhat")
const { developmentChains } = require("../helper-hardhat-config")
const { verify } = require("../utils/verify")
const { delegate } = require("../utils/delegate")

module.exports = async ({ getNamedAccounts, deployments }) => {
    const { deploy, log } = deployments
    const { deployer } = await getNamedAccounts()

    const governanceToken = await deploy("GovernanceToken", {
        from: deployer,
        args: [],
        log: true,
        waitConfirmations: network.config.blockConfirmations || 1,
    })
    console.log(`GovernanceToken deployed at ${governanceToken.address}!`)

    if (!developmentChains.includes(network.name) && process.env.ETHERSCAN_API_KEY) {
        console.log("Verifying...")
        await verify(governanceToken.address, [])
    }

    await delegate(governanceToken.address, deployer)
    console.log("Delegated!")
}

module.exports.tags = ["all", "token"]
