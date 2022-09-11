// imports
const { ethers, run, network } = require("hardhat")

// async main
async function main() {
    // create contract factory
    const SimpleStorageFactory = await ethers.getContractFactory(
        "SimpleStorage"
    )

    // deploy contract
    console.log("Deploying contract...")
    const simpleStorage = await SimpleStorageFactory.deploy()
    await simpleStorage.deployed() // returns a promise that a contract is deployed
    console.log(`Deployed contract to: ${simpleStorage.address}`)

    // check if current network is not using hardhat (chainId 31337) and that we
    // have an existing ETHERSCAN_API_KEY.
    // If true, run the verify function to verify the contract
    // We cannot verify on a hardhat network as there is no hardhat etherscan.
    if (network.config.chainId !== 31337 && process.env.ETHERSCAN_API_KEY) {
        await simpleStorage.deployTransaction.wait(6) // wait ~6 blocks after contract is deployed as best practice
        await verify(simpleStorage.address, []) // verify contract
    }

    // interact with contract
    // Retrieve current value
    const currentValue = await simpleStorage.retrieve()
    console.log(`Current value is: ${currentValue}`)
    // Update current value
    const transactionResponse = await simpleStorage.store(7)
    await transactionResponse.wait(1)
    const updatedValue = await simpleStorage.retrieve()
    console.log(`Updated value is: ${updatedValue}`)
}

// this function is used to verify a contract, given a contractAddress and arguments for constructor (if any)
async function verify(contractAddress, args) {
    console.log("Verifying contract...")
    try {
        await run("verify:verify", {
            address: contractAddress,
            constructorArguments: args,
        })
    } catch (error) {
        if (error.message.toLowerCase().includes("already verified")) {
            console.log("Already verified.")
        } else {
            console.log(error)
        }
    }
}

// main
main().then(() =>
    process.exit(0).catch((error) => {
        console.error(error)
        process.exit(1)
    })
)
