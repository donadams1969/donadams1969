
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

/// @title VALORBadgeNFT
/// @notice ERC721 badge for verified contributors and access control for VBLKx
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721Enumerable.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract VALORBadgeNFT is ERC721Enumerable, Ownable {
    uint256 public nextTokenId;
    mapping(address => bool) public verified;

    constructor() ERC721("VALOR Contributor Badge", "VBLKBADGE") {}

    function mint(address to) external onlyOwner {
        require(!verified[to], "Already verified");
        _safeMint(to, nextTokenId);
        verified[to] = true;
        nextTokenId++;
    }

    function isVerified(address user) external view returns (bool) {
        return balanceOf(user) > 0;
    }
}
