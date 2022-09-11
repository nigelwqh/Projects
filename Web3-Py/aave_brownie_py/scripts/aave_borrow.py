from scripts.helpful_scripts import get_account
from brownie import config, network, interface
from scripts.get_weth import get_weth
from web3 import Web3

# 0.1
amount = Web3.toWei(0.08, "ether")


def main():
    account = get_account()
    # Get weth token address
    erc20_address = config["networks"][network.show_active()]["weth_token"]
    if network.show_active() in ["mainnet-fork"]:
        get_weth()
    # Get Aave lending pool
    lending_pool = get_lending_pool()
    # Approve sending out ERC20 tokens
    approve_erc20(amount, lending_pool.address, erc20_address, account)
    # Deposit ERC20 token into lending pool
    print("Depositing...")
    txn = lending_pool.deposit(
        erc20_address, amount, account.address, 0, {"from": account}
    )
    txn.wait(1)
    print("Deposited!")
    # Borrow from lending pool
    borrowable_eth, total_debt = get_borrowable_data(lending_pool, account)
    print("Lets borrow!")
    # Get DAI in terms of ETH
    dai_eth_price = get_asset_price(
        config["networks"][network.show_active()]["dai_eth_price_feed"]
    )
    amount_dai_to_borrow = (1 / dai_eth_price) * (
        borrowable_eth * 0.95
    )  # borrowable_eth -> borrowable_dai * 95%
    print(f"We are going to borrow {amount_dai_to_borrow} DAI.")
    # Now we will borrow!
    dai_address = config["networks"][network.show_active()]["dai_token"]
    borrow_txn = lending_pool.borrow(
        dai_address,
        Web3.toWei(amount_dai_to_borrow, "ether"),
        1,
        0,
        account.address,
        {"from": account},
    )
    borrow_txn.wait(1)
    print("We borrowed some DAI!")
    get_borrowable_data(lending_pool, account)
    # Repay all the DAI borrowed
    repay_all(amount, lending_pool, account)
    print("You just deposited, borrowed and repayed with Aave, Brownie and Chainlink!")


def get_lending_pool():
    lending_pool_addresses_provider = interface.ILendingPoolAddressesProvider(
        config["networks"][network.show_active()]["lending_pool_addresses_provider"]
    )
    lending_pool_address = lending_pool_addresses_provider.getLendingPool()
    lending_pool = interface.ILendingPool(lending_pool_address)
    return lending_pool


def approve_erc20(amount, spender, erc20_address, account):
    print("Approving ERC20 token...")
    erc20 = interface.IERC20(erc20_address)
    txn = erc20.approve(spender, amount, {"from": account})
    txn.wait(1)
    print("Approved!")
    return txn


def repay_all(amount, lending_pool, account):
    approve_erc20(
        Web3.toWei(amount, "ether"),
        lending_pool.address,
        config["networks"][network.show_active()]["dai_token"],
        account,
    )
    repay_txn = lending_pool.repay(
        config["networks"][network.show_active()]["dai_token"],
        amount,
        1,
        account.address,
        {"from": account},
    )
    repay_txn.wait(1)
    print("Repaid!")


def get_borrowable_data(lending_pool, account):
    (
        total_collateral_eth,
        total_debt_eth,
        available_borrows_eth,
        current_liquidation_threshold,
        ltv,
        health_factor,
    ) = lending_pool.getUserAccountData(account.address)

    available_borrows_eth = Web3.fromWei(available_borrows_eth, "ether")
    total_collateral_eth = Web3.fromWei(total_collateral_eth, "ether")
    total_debt_eth = Web3.fromWei(total_debt_eth, "ether")
    print(f"You have {total_collateral_eth} worth of ETH deposited.")
    print(f"You have {total_debt_eth} worth of ETH borrowed.")
    print(f"You can borrow {available_borrows_eth} worth of ETH.")
    return (float(available_borrows_eth), float(total_debt_eth))


def get_asset_price(price_feed_address):
    dai_eth_price_feed = interface.IAggregatorV3(price_feed_address)
    latest_price = dai_eth_price_feed.latestRoundData()[1]
    converted_latest_price = Web3.fromWei(latest_price, "ether")
    print(f"The DAI/ETH price is {converted_latest_price}")
    return float(converted_latest_price)
