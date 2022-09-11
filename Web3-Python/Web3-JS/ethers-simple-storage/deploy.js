// import modules
const ethers = require("ethers")
const fs = require("fs-extra")
require("dotenv").config()

async function main() {
    // connect to ganache blockchain via RPC
    const provider = new ethers.providers.JsonRpcProvider(process.env.RPC_URL)

    // initialize a wallet within ganache with the private key
    const encryptedJson = fs.readFileSync("./.encryptedKey.json", "utf-8")
    let wallet = new ethers.Wallet.fromEncryptedJsonSync(
        encryptedJson,
        process.env.PRIVATE_KEY_PASSWORD
    )
    wallet = await wallet.connect(provider)
    //   const wallet = new ethers.Wallet(process.env.PRIVATE_KEY, provider);

    // get abi of the SimpleStorage contract (this contains all the methods and metadata that our contract has)
    const abi = fs.readFileSync(
        "./SimpleStorage_sol_SimpleStorage.abi",
        "utf-8"
    )

    // get binary of the SimpleStorage contract (this is the compiled binary code of the contract)
    const binary = fs.readFileSync(
        "./SimpleStorage_sol_SimpleStorage.bin",
        "utf-8"
    )

    // connect to new contract factory object
    const contractFactory = new ethers.ContractFactory(abi, binary, wallet)

    // deploy the contract
    console.log("Deploying, please wait...")
    const contract = await contractFactory.deploy()

    // wait 1 block for the transaction to finish
    await contract.deployTransaction.wait(1)
    console.log(`Contract Address: ${contract.address}`)

    // call retrieve method from the SimpleStorage contract
    const currentFavoriteNumber = await contract.retrieve()
    console.log(`Current favorite number: ${currentFavoriteNumber.toString()}`)

    // update contract by calling store which will cost gas
    // wait for transaction response
    // wait for transaction receipt
    const transactionResponse = await contract.store("7")
    const transactionReceipt = await transactionResponse.wait(1)
    const updatedFavoriteNumber = await contract.retrieve()
    console.log(`Updated favorite number: ${updatedFavoriteNumber}`)
}

main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error)
        process.exit(1)
    })
