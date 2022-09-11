const { run } = require("hardhat")

// this function is used to verify a contract, given a contractAddress and arguments for constructor (if any)
const verify = async (contractAddress, args) => {
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

module.exports = { verify }
