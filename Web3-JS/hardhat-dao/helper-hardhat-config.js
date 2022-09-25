const { ethers } = require("hardhat")

const networkConfig = {
    5: {
        name: "goerli",
        ethUsdPriceFeed: "0xD4a33860578De61DBAbDc8BFdb98FD742fA7028e",
    },
    31337: {
        name: "hardhat",
    },
}

const developmentChains = ["hardhat", "localhost"]
const MIN_DELAY = 3600 // 1 hour
const VOTING_PERIOD = 5
const VOTING_DELAY = 1
const QUORUM_PERCENTAGE = 4
const ADDRESS_ZERO = "0x0000000000000000000000000000000000000000"
const NEW_STORE_VALUE = 77
const FUNC = "store"
const PROPOSAL_DESCRIPTION = "Proposal #1: Store 77 in the box!"
const proposalsFile = "proposals.json"

module.exports = {
    networkConfig,
    developmentChains,
    MIN_DELAY,
    VOTING_DELAY,
    VOTING_PERIOD,
    QUORUM_PERCENTAGE,
    ADDRESS_ZERO,
    NEW_STORE_VALUE,
    FUNC,
    PROPOSAL_DESCRIPTION,
    proposalsFile,
}
