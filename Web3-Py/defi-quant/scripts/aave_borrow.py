from brownie import accounts, interface
from scripts.get_weth import get_weth
from web3 import Web3


def main():
    # 1. Need the account that is going to call the function
    account = accounts[0]

    # 2. Get WETH
    # WETH mainnet address. WETH allows us to use ETH as if it were an ERC20
    erc20_address = "0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2"
    get_weth(account)

    # 3. Get Lending Pool and approve ERC20 token
    lending_pool = get_lending_pool()
    amount = Web3.toWei(0.1, "ether")
    approve_erc20(amount, lending_pool.address, erc20_address, account)

    # 4. Deposit to Aave
    print("Depositing...")
    txn = lending_pool.deposit(
        erc20_address, amount, account.address, 0, {"from": account}
    )
    txn.wait(1)
    print("Done with deposit!")

    # 5. Borrow from Aave
    avail_to_borrow = get_borrowable_data(lending_pool, account)
    dai_to_borrow = Web3.toWei(100, "ether")
    dai_address = "0x6B175474E89094C44Da98b954EedeAC495271d0F"
    print("Borrowing some DAI...")
    txn = lending_pool.borrow(
        dai_address, dai_to_borrow, 1, 0, account.address, {"from": account}
    )
    txn.wait(1)
    print("Borrowed some DAI!")
    get_borrowable_data(lending_pool, account)

    # 6. Repay
    print("Repaying DAI...")
    approve_erc20(dai_to_borrow, lending_pool.address, dai_address, account)
    txn = lending_pool.repay(
        dai_address, dai_to_borrow, 1, account.address, {"from": account}
    )
    txn.wait(1)
    print("You have repaid your DAI borrowed!")
    get_borrowable_data(lending_pool, account)


def get_lending_pool():
    lending_pool_address_provider_address = "0xB53C1a33016B2DC2fF3653530bfF1848a515c8c5"
    lending_pool_address_provider = interface.ILendingPoolAddressesProvider(
        lending_pool_address_provider_address
    )
    lending_pool_address = lending_pool_address_provider.getLendingPool()
    lending_pool = interface.ILendingPool(lending_pool_address)
    return lending_pool


# Approve the WETH token to be deposited to Aave
def approve_erc20(amount, lending_pool_address, erc20_address, account):
    print("Approving ERC20...")
    erc20 = interface.IERC20(erc20_address)
    txn = erc20.approve(lending_pool_address, amount, {"from": account})
    txn.wait(1)
    print("Approved!")


def get_borrowable_data(lending_pool, account):
    (
        total_collateral_eth,
        total_debt_eth,
        available_borrow_eth,
        current_liquidation_threshold,
        tlv,
        health_factor,
    ) = lending_pool.getUserAccountData(account.address)
    total_collateral_eth = Web3.fromWei(total_collateral_eth, "ether")
    available_borrow_eth = Web3.fromWei(available_borrow_eth, "ether")
    total_debt_eth = Web3.fromWei(total_debt_eth, "ether")

    print(f"You have {total_collateral_eth} ETH in collateral.")
    print(f"You have {available_borrow_eth} ETH available to borrow.")
    print(f"You have {total_debt_eth} ETH borrowed.")

    return float(available_borrow_eth)
