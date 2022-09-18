const { developmentChains, networkConfig } = require("../../helper-hardhat-config")
const { network, getNamedAccounts, deployments, ethers } = require("hardhat")
const { assert, expect } = require("chai")

developmentChains.includes(network.name)
    ? describe.skip
    : describe("Raffle Staging Tests", () => {
          let raffle, raffleEntranceFee, deployer

          beforeEach(async () => {
              deployer = (await getNamedAccounts()).deployer
              raffle = await ethers.getContract("Raffle", deployer)
              raffleEntranceFee = await raffle.getEntranceFee()
          })

          describe("fulfillRandomWords", () => {
              it("works with live Chainlink keepers and Chainlink VRF, we get a random winner", async () => {
                  // enter the raffle
                  console.log("Setting up test...")
                  const startingTimestamp = await raffle.getLatestTimestamp()
                  const accounts = await ethers.getSigners()

                  // set up listener before we enter the raffle, just in case the blockchain moves really fast
                  console.log("Setting up listener...")
                  await new Promise(async (resolve, reject) => {
                      raffle.once("WinnerPicked", async () => {
                          console.log("WinnerPicked event fired!")

                          try {
                              // add asserts here
                              setTimeout(async () => {
                                  console.log("Getting recent winner...")
                                  const recentWinner = await raffle.getRecentWinner()
                                  console.log(`Recent winner is ${recentWinner.toString()}!`)
                                  console.log("Getting raffle state...")
                                  const raffleState = await raffle.getRaffleState()
                                  console.log(`Raffle state is ${raffleState.toString()}`)
                                  console.log("Getting winner's ending balance...")
                                  const winnerEndingBalance = await accounts[0].getBalance()
                                  console.log(
                                      `Winners ending balance is ${winnerEndingBalance.toString()}!`
                                  )
                                  const endingTimestamp = await raffle.getLatestTimestamp()

                                  console.log("Asserting...")
                                  await expect(raffle.getPlayer(0)).to.be.reverted
                                  assert.equal(recentWinner.toString(), accounts[0].address)
                                  assert.equal(raffleState, 0)
                                  assert.equal(
                                      winnerEndingBalance.toString(),
                                      winnerStartingBalance.add(raffleEntranceFee).toString()
                                  )
                                  assert(endingTimestamp > startingTimestamp)
                                  resolve()
                              }, 15000)
                          } catch (e) {
                              console.log(e)
                              reject(e)
                          }
                      })
                      // Entering raffle
                      console.log("Entering raffle...")
                      const tx = await raffle.enterRaffle({ value: raffleEntranceFee })
                      await tx.wait(6)
                      console.log("Ok, time to wait...")
                      const winnerStartingBalance = await accounts[0].getBalance()
                      console.log(`Winner starting balance is ${winnerStartingBalance.toString()}`)
                  })
              })
          })
      })
