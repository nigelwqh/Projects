// SPDX-License-Identifier: MIT

pragma solidity ^0.8.0;

contract Whitelist {
    // State variables

    // Max number of whitelisted addresses allowed
    uint8 public maxWhitelistedAddresses;
    // Create a mapping of whitelistedAddresses
    // If an address is whitelisted, we would set it to true, it is false by default for all other addresses.
    mapping(address => bool) public whitelistedAddresses;
    // Used to keep track of how many addresses have been whitelisted
    uint8 public numAddressesWhitelisted;

    // Constructor

    // Set the max number of whitelisted addresses when contract is deployed
    constructor(uint8 _maxWhitelistedAddresses) {
        maxWhitelistedAddresses = _maxWhitelistedAddresses;
    }

    // Functions

    // Adds address of the sender to whitelist
    function addAddressToWhitelist() public {
        // check if user has already been whitelisted, throw error if true
        require(
            !whitelistedAddresses[msg.sender],
            "Sender has already been whitelisted!"
        );

        // check if numAddressesWhitelisted <= maxWhitelistedAddresses, if not throw an error
        require(
            numAddressesWhitelisted <= maxWhitelistedAddresses,
            "More addresses cannot be added, limit reached"
        );

        // Add address to whitelistedAddresses array
        whitelistedAddresses[msg.sender] = true;

        // Increase number of whitelisted addresses
        numAddressesWhitelisted += 1;
    }
}
