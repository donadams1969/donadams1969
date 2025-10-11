// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/token/ERC721/IERC721.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract JAXXMicro is ERC20, Ownable {
    IERC721 public nftContract;
    uint256 public rewardRate;

    event RewardIssued(address indexed to, uint256 amount);

    constructor(address _nftContract, uint256 _rewardRate) ERC20("JAXX Micro", "JAXX") {
        nftContract = IERC721(_nftContract);
        rewardRate = _rewardRate;
        _mint(msg.sender, 1_000_000 * 10 ** decimals());
    }

    function issueReward(address to, uint256 nftId) external onlyOwner {
        require(nftContract.ownerOf(nftId) == to, "User must own specified NFT");
        uint256 rewardAmount = rewardRate * 10 ** decimals();
        _transfer(owner(), to, rewardAmount);
        emit RewardIssued(to, rewardAmount);
    }

    function setRewardRate(uint256 newRate) external onlyOwner {
        rewardRate = newRate;
    }

    function setNFTContract(address newNFT) external onlyOwner {
        nftContract = IERC721(newNFT);
    }
}
