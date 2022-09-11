from scripts.helpful_scripts import get_account
from brownie import interface, config, network


def get_weth():
    account = get_account()
    # account = accounts[0]
    weth = interface.IWeth(config["networks"][network.show_active()]["weth_token"])
    txn = weth.deposit({"from": account, "value": 0.08 * 10**18})
    txn.wait(1)
    print("Received 0.1 WETH")
    return txn


def main():
    get_weth()
