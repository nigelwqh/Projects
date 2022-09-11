const { assert, expect } = require("chai")
const { ethers } = require("hardhat")

describe("SimpleStorage", function () {
    let simpleStorageFactory, simpleStorage

    // before each test, run a set of actions
    beforeEach(async function () {
        // deploy contract
        simpleStorageFactory = await ethers.getContractFactory("SimpleStorage")
        simpleStorage = await simpleStorageFactory.deploy()
    })

    // test function
    it("Should start with a favorite number of 0", async function () {
        const currentValue = await simpleStorage.retrieve()
        const expectedValue = "0"
        assert.equal(currentValue.toString(), expectedValue)
    })
    it("Should update when we call store", async function () {
        const expectedValue = "7"
        const transactionResponse = await simpleStorage.store(expectedValue)
        await transactionResponse.wait(1)
        const currentValue = await simpleStorage.retrieve()
        assert.equal(currentValue.toString(), expectedValue)
    })
    it("Should add person and their favorite number", async function () {
        const personName = "Nigel"
        const favoriteNumber = 7
        const transactionResponse = await simpleStorage.addPerson(
            personName,
            favoriteNumber
        )
        await transactionResponse.wait(1)
        const person = await simpleStorage.people(0)
        assert.equal(person.name, personName)
        assert.equal(person.favoriteNumber.toString(), favoriteNumber)
    })
})
