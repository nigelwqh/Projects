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
const INITIAL_SUPPLY = "2000000000000000000000000" // 20 million

module.exports = {
    networkConfig,
    developmentChains,
    INITIAL_SUPPLY,
}
