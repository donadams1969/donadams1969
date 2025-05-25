// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract JAXX is ERC721URIStorage, Ownable {
    uint256 private _tokenIdCounter;

    constructor() ERC721("JAXX Service Animal NFT", "JAXX") {}

    function mintServiceBadge(address to, string memory uri) public onlyOwner {
        uint256 tokenId = _tokenIdCounter;
        _tokenIdCounter += 1;
        _safeMint(to, tokenId);
        _setTokenURI(tokenId, uri);
    }

    function currentTokenId() public view returns (uint256) {
        return _tokenIdCounter;
    }
}
