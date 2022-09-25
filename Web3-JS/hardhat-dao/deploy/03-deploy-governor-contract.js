const { network } = require("hardhat")
const {
    developmentChains,
    VOTING_DELAY,
    VOTING_PERIOD,
    QUORUM_PERCENTAGE,
} = require("../helper-hardhat-config")
const { verify } = require("../utils/verify")

module.exports = async ({ getNamedAccounts, deployments }) => {
    const { deploy, log, get } = deployments
    const { deployer } = await getNamedAccounts()

    const governanceToken = await get("GovernanceToken") // get governance token contract
    const timeLock = await get("TimeLock") // get timelock contract

    ARGUMENTS = [
        governanceToken.address,
        timeLock.address,
        VOTING_DELAY,
        VOTING_PERIOD,
        QUORUM_PERCENTAGE,
    ]

    const governorContract = await deploy("GovernorContract", {
        from: deployer,
        args: ARGUMENTS,
        log: true,
        waitConfirmations: network.config.blockConfirmations || 1,
    })
    console.log(`GovernorContract deployed at ${governorContract.address}!`)

    if (!developmentChains.includes(network.name) && process.env.ETHERSCAN_API_KEY) {
        console.log("Verifying...")
        await verify(governorContract.address, [])
    }
}

module.exports.tags = ["all", "governorContract"]
