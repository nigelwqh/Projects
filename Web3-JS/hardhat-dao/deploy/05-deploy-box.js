const { network, ethers } = require("hardhat")
const { developmentChains } = require("../helper-hardhat-config")
const { verify } = require("../utils/verify")

module.exports = async ({ getNamedAccounts, deployments }) => {
    const { deploy, log, get } = deployments
    const { deployer } = await getNamedAccounts()

    const box = await deploy("Box", {
        from: deployer,
        args: [],
        log: true,
        waitConfirmations: network.config.blockConfirmations || 1,
    })
    console.log(`Box deployed at ${box.address}!`)

    const timeLock = await ethers.getContract("TimeLock")
    const boxContract = await ethers.getContractAt("Box", box.address)
    const transferOwnerTx = await boxContract.transferOwnership(timeLock.address)
    await transferOwnerTx.wait(1)
    console.log("Ownership of Box contract transferred to TimeLock contract!")

    if (!developmentChains.includes(network.name) && process.env.ETHERSCAN_API_KEY) {
        console.log("Verifying...")
        await verify(box.address, [])
    }
}

module.exports.tags = ["all", "box"]
