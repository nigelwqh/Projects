// SPDX-License-Identifier: MIT

pragma solidity ^0.8.1;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";

contract GameItem is ERC721 {
    constructor() ERC721("GameItem", "ITM") {
        // mint a NFT to yourself
        _mint(msg.sender, 1);
    }
}
