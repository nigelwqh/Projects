from brownie import Lottery, accounts, network, config
from scripts.deploy import deploy_lottery


def test_entrance_fee():

    account = accounts[0]
    lottery = Lottery.deploy(
        config["networks"][network.show_active()]["eth_usd_price_feed"],
        {"from": account},
    )
    # assert lottery.getEntranceFee() > Web3.toWei(0.029, "ether")
    # assert lottery.getEntranceFee()  Web3.toWei(0.031, "ether")
