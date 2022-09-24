const { assert, expect } = require("chai")
const { getNamedAccounts, deployments, ethers } = require("hardhat")
const { INITIAL_SUPPLY } = require("../../helper-hardhat-config")

describe("TestToken Unit Tests", () => {
    let testToken, deployer, user1
    beforeEach(async () => {
        const accounts = await getNamedAccounts()
        deployer = accounts.deployer
        user1 = accounts.user1
        await deployments.fixture("all")
        testToken = await ethers.getContract("TestToken", deployer)
    })
    it("deployed successfully", async () => {
        assert(testToken.address)
    })
    describe("constructor", () => {
        it("should have correct INITIAL_SUPPLY of token", async () => {
            const totalSupply = await testToken.totalSupply()
            assert.equal(totalSupply.toString(), INITIAL_SUPPLY)
        })
        it("initializes with the correct name and symbol", async () => {
            const name = await testToken.name()
            const symbol = await testToken.symbol()
            assert.equal(name.toString(), "TestToken")
            assert.equal(symbol.toString(), "TT")
        })
    })
    describe("mint", () => {
        it("user cannot mint", async () => {
            try {
                await testToken._mint(deployer, 100)
                assert(False)
            } catch (e) {
                assert(e)
            }
        })
    })
    describe("transfer", () => {
        it("should allow transferring of tokens to an address", async () => {
            const transferAmount = ethers.utils.parseEther("100")
            await testToken.transfer(user1, transferAmount)
            expect(await testToken.balanceOf(user1)).to.equal(transferAmount)
        })
        it("emits a transfer event when a transfer occurs", async () => {
            const transferAmount = ethers.utils.parseEther("100")
            expect(await testToken.transfer(user1, transferAmount)).to.emit(testToken, "Transfer")
        })
    })
    describe("allowance", () => {
        beforeEach(async () => {
            playerToken = await ethers.getContract("TestToken", user1)
        })
        it("should approve other addresses to spend token", async () => {
            const tokenToSpend = ethers.utils.parseEther("10")
            await testToken.approve(user1, tokenToSpend)
            const testToken1 = await ethers.getContract("TestToken", user1)
            await testToken1.transferFrom(deployer, user1, tokenToSpend)
            expect(await testToken1.balanceOf(user1)).to.equal(tokenToSpend)
        })
        it("does not allow an unapproved user to transfer", async () => {
            const tokenToSpend = ethers.utils.parseEther("20")
            await expect(
                playerToken.transferFrom(deployer, user1, tokenToSpend)
            ).to.be.revertedWith("ERC20: insufficient allowance")
        })
        it("emits an approval event when an approval occurs", async () => {
            const tokenToSpend = ethers.utils.parseEther("20")
            await expect(testToken.approve(user1, tokenToSpend)).to.emit(testToken, "Approval")
        })
        it("allowance being set is accurate", async () => {
            const tokenToSpend = ethers.utils.parseEther("20")
            await testToken.approve(user1, tokenToSpend)
            const allowance = await testToken.allowance(deployer, user1)
            assert.equal(allowance.toString(), tokenToSpend)
        })
        it("won't allow a user to go over the allowance", async () => {
            const tokenToSpend = ethers.utils.parseEther("20")
            await testToken.approve(user1, tokenToSpend)
            await expect(
                testToken.transferFrom(deployer, user1, ethers.utils.parseEther("50"))
            ).to.be.revertedWith("ERC20: insufficient allowance")
        })
    })
})
