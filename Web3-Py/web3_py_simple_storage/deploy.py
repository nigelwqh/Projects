from solcx import compile_standard
from web3 import Web3
from dotenv import load_dotenv
import json
import os

load_dotenv()

with open(
    "/Users/nigelwong/Desktop/Web3/web3_py_simple_storage/SimpleStorage.sol", "r"
) as file:
    simple_storage_file = file.read()

# Compile Solidity
compiled_sol = compile_standard(
    {
        "language": "Solidity",
        "sources": {"SimpleStorage.sol": {"content": simple_storage_file}},
        "settings": {
            "outputSelection": {
                "*": {"*": ["abi", "metadata", "evm.bytecode", "evm.sourceMap"]}
            }
        },
    },
    solc_version="0.8.0",
)

with open("compiled_code.json", "w") as file:
    json.dump(compiled_sol, file)

### bytecode and abi are required when deploying a smart contract onto the blockchain
# get bytecode
bytecode = compiled_sol["contracts"]["SimpleStorage.sol"]["SimpleStorage"]["evm"][
    "bytecode"
]["object"]

# get abi
abi = compiled_sol["contracts"]["SimpleStorage.sol"]["SimpleStorage"]["abi"]

# for connecting to goerli blockchain via ganache
w3 = Web3(
    Web3.HTTPProvider("https://goerli.infura.io/v3/b24c479742154fae9c5d908f2f08f429")
)
chain_id = 5
my_address = "0x5ad6a56173883E210538318320c0d9200FE7deb2"
private_key = os.getenv("PRIVATE_KEY")

# Create the contract in python
SimpleStorage = w3.eth.contract(abi=abi, bytecode=bytecode)
# Get latest transaction
nonce = w3.eth.getTransactionCount(my_address)

# 1. Build a transaction
transaction = SimpleStorage.constructor().buildTransaction(
    {
        "gasPrice": w3.eth.gasPrice,
        "chainId": chain_id,
        "from": my_address,
        "nonce": nonce,
    }
)
# 2. Sign a transaction
signed_txn = w3.eth.account.signTransaction(transaction, private_key=private_key)

# 3. Send a transaction
print("Deploying Contract...")
txn_hash = w3.eth.sendRawTransaction(signed_txn.rawTransaction)

# 4. Wait for transaction to finish
txn_receipt = w3.eth.waitForTransactionReceipt(txn_hash)
print("Contract Deployed!")

##### Working with the contract
# Always need Contract Address and Contract ABI
simple_storage = w3.eth.contract(address=txn_receipt.contractAddress, abi=abi)
# Interacting with transactions
# Call -> Simulate making the call and getting a return value
# Transact -> Actually making a state change

# Initial value of favorite number
print(simple_storage.functions.retrieve().call())

print("Updating Contract...")
# 1. Build a transaction
store_transaction = simple_storage.functions.store(15).buildTransaction(
    {
        "gasPrice": w3.eth.gasPrice,
        "chainId": chain_id,
        "from": my_address,
        "nonce": nonce + 1,
    }
)
# 2. Sign a transaction
signed_store_txn = w3.eth.account.signTransaction(
    store_transaction, private_key=private_key
)
# 3. Send a transaction
send_store_txn = w3.eth.sendRawTransaction(signed_store_txn.rawTransaction)
# 4. Wait for transaction to finish
txn_receipt = w3.eth.waitForTransactionReceipt(send_store_txn)
print("Contract updated!")
print(simple_storage.functions.retrieve().call())
