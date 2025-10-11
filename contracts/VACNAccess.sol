// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract VACNAccess is Ownable {
    IERC20 public vblkToken;
    uint256 public accessThreshold;

    mapping(address => string[]) private userClaims;
    event FOIAClaimSubmitted(address indexed user, string claimHash);

    constructor(IERC20 _vblkToken, uint256 _threshold) {
        vblkToken = _vblkToken;
        accessThreshold = _threshold;
    }

    function submitClaim(string calldata claimHash) external {
        require(vblkToken.balanceOf(msg.sender) >= accessThreshold, "Insufficient VBLK for access");
        userClaims[msg.sender].push(claimHash);
        emit FOIAClaimSubmitted(msg.sender, claimHash);
    }

    function getMyClaims() external view returns (string[] memory) {
        return userClaims[msg.sender];
    }

    function updateThreshold(uint256 newThreshold) external onlyOwner {
        accessThreshold = newThreshold;
    }

    function updateToken(address newToken) external onlyOwner {
        vblkToken = IERC20(newToken);
    }
}
