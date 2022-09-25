const { proposalsFile, developmentChains, VOTING_PERIOD } = require("../helper-hardhat-config")
const fs = require("fs")
const { network, ethers } = require("hardhat")
const { moveBlocks } = require("../utils/move-blocks")

const index = 0
async function main(proposalIndex) {
    const proposals = JSON.parse(fs.readFileSync(proposalsFile, "utf8"))
    const proposalId = proposals[network.config.chainId][proposalIndex]
    // 0 = Against, 1 = For, 2 = Abstain
    const voteWay = 1
    const governor = await ethers.getContract("GovernorContract")
    const reason = "xxxxxx"
    const voteTxResponse = await governor.castVoteWithReason(proposalId, voteWay, reason)
    await voteTxResponse.wait(1)
    const proposalState = await governor.state(proposalId)
    console.log(`Current proposal state is ${proposalState}`)

    if (developmentChains.includes(network.name)) {
        await moveBlocks(VOTING_PERIOD + 1)
    }
    console.log("Voted!")
    console.log(`Current proposal state is ${await governor.state(proposalId)}`)
}

// main
main(index).then(() =>
    process.exit(0).catch((error) => {
        console.error(error)
        process.exit(1)
    })
)
