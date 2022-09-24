const { getNamedAccounts, ethers, deployments } = require("hardhat")
const { assert } = require("chai")
const { developmentChains, INITIAL_SUPPLY } = require("../../helper-hardhat-config")

!developmentChains.includes(network.name)
    ? describe.skip
    : describe("TestToken Unit Tests", () => {
          let testToken, deployer, user1
          beforeEach(async () => {
              const accounts = await getNamedAccounts()
              deployer = accounts.deployer
              user1 = accounts.user1

              await deployments.fixture(["all"])
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
              it("initializes with the correct token name and symbol", async () => {
                  const name = (await testToken.name()).toString()
                  const symbol = (await testToken.symbol()).toString()
                  assert.equal(name, "TestToken")
                  assert.equal(symbol, "TT")
              })
          })
      })
