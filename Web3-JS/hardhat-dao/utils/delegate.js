const { run } = require("hardhat")

const delegate = async (governanceTokenAddress, delegatedAccount) => {
    const governanceToken = await ethers.getContractAt("GovernanceToken", governanceTokenAddress)
    const tx = await governanceToken.delegate(delegatedAccount)
    await tx.wait(1)
    console.log(`Checkpoints ${await governanceToken.numCheckpoints(delegatedAccount)}`)
}

module.exports = {
    delegate,
}
