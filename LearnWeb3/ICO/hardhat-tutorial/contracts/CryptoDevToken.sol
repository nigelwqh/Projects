// SPDX-License-Identifier: MIT

pragma solidity ^0.8.4;

import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "./ICryptoDevs.sol";

contract CryptoDevToken is ERC20, Ownable {
    // State Variables

    // price of one token is 0.001 ether
    uint256 public constant tokenPrice = 0.001 ether;

    // 10 tokens will be assigned to each NFT the user owns
    uint256 public constant tokensPerNFT = 10 * 10**18;

    // max number of tokens is 10,000
    uint256 public constant maxTotalSupply = 10000 * 10**18;

    // Initialize imported contracts
    Ownable ownable;
    ERC20 erc20;
    ICryptoDevs CryptoDevsNFT;

    // mapping to keep track of which tokenIds have been claimed
    mapping(uint256 => bool) public tokenIdsClaimed;

    // Constructor
    constructor(address _cryptoDevsContract) ERC20("Crypto Devs Token", "CD") {
        CryptoDevsNFT = ICryptoDevs(_cryptoDevsContract);
    }

    // Functions

    /**
     * @dev Mints `amount` number of CryptoDevTokens
     * Requirements:
     * - `msg.value` should be equal or greater than the tokenPrice * amount
     */
    function mint(uint256 amount) public payable {
        // required value of ether to mint tokens
        uint256 _requiredAmount = tokenPrice * amount;
        require(msg.value >= _requiredAmount, "Insufficient ether sent.");
        // checked that total number of supply minted does not exceed total supply, else revert transaction
        uint256 amountToMintInDecimals = amount * 10**18;
        require(
            (erc20.totalSupply() + amountToMintInDecimals) <= maxTotalSupply,
            "Exceeds the max total supply available."
        );
        // call the internal _mint function from Openzeppelin's ERC20 contract
        _mint(msg.sender, amountToMintInDecimals);
    }

    /**
     * @dev Mints tokens based on the number of NFT's held by the sender
     * Requirements:
     * balance of Crypto Dev NFT's owned by the sender should be greater than 0
     * Tokens should have not been claimed for all the NFTs owned by the sender
     */
    function claim() public payable {
        address sender = msg.sender;
        // get number of NFTs owned by sender
        uint256 balance = CryptoDevsNFT.balanceOf(sender);
        require(balance > 0, "Address does not hold any CryptoDev NFTs.");
        // amount keeps track of number of unclaimed tokenIds
        uint256 amount = 0;
        // loop over the balance of NFTs owned by sender and get the tokenId at given index of the balance list
        for (uint256 i = 0; i < balance; i++) {
            uint256 tokenId = CryptoDevsNFT.tokenOfOwnerByIndex(sender, i);
            // if tokenId is not claimed, allow to claim and increase the amount
            // and add tokenid to the mapping of tokenIdsClaimed
            if (!tokenIdsClaimed[tokenId]) {
                amount += 1;
                tokenIdsClaimed[tokenId] = true;
            }
        }
        // if all tokens have been claimed per NFTs owned, revert transaction
        require(amount > 0, "You have already claimed all the tokens.");
        // call the internal _mint function from Openzeppelin's ERC20 contract
        _mint(sender, amount * tokensPerNFT);
    }

    /**
     * @dev withdraws all ETH and tokens sent to the contract
     * Requirements:
     * wallet connected must be owner's address
     */
    function withdraw() public onlyOwner {
        address _owner = ownable.owner();
        uint256 amount = address(this).balance;
        (bool sent, ) = _owner.call{value: amount}("");
        require(sent, "Failed to withdraw ether");
    }

    // Function to receive Ether. msg.data must be empty
    receive() external payable {}

    // Fallback function is called when msg.data is not empty
    fallback() external payable {}
}
