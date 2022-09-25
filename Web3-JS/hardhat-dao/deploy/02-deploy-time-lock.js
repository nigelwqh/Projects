const { network, ethers } = require("hardhat")
const { developmentChains, MIN_DELAY } = require("../helper-hardhat-config")
const { verify } = require("../utils/verify")
const { delegate } = require("../utils/delegate")

module.exports = async ({ getNamedAccounts, deployments }) => {
    const { deploy, log } = deployments
    const { deployer } = await getNamedAccounts()

    ARGUMENTS = [MIN_DELAY, [], []]

    const timeLock = await deploy("TimeLock", {
        from: deployer,
        args: ARGUMENTS,
        log: true,
        waitConfirmations: network.config.blockConfirmations || 1,
    })
    console.log(`TimeLock deployed at ${timeLock.address}!`)

    if (!developmentChains.includes(network.name) && process.env.ETHERSCAN_API_KEY) {
        console.log("Verifying...")
        await verify(timeLock.address, [])
    }
}

module.exports.tags = ["all", "timeLock"]
