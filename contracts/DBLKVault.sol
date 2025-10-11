// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";

contract DBLKVault is Ownable {
    IERC20 public immutable token;
    address[] public approvers;
    uint256 public unlockTimestamp;
    uint256 public approvalsRequired;
    mapping(address => bool) public hasApproved;

    event VaultLocked(uint256 until);
    event VaultUnlocked();
    event ApprovalGranted(address indexed approver);
    event Withdrawn(address indexed to, uint256 amount);

    modifier onlyApprover() {
        require(isApprover(msg.sender), "Not authorized");
        _;
    }

    constructor(IERC20 _token, address[] memory _approvers, uint256 _approvalsRequired) {
        require(_approvalsRequired <= _approvers.length, "Too many approvals required");
        token = _token;
        approvers = _approvers;
        approvalsRequired = _approvalsRequired;
    }

    function lockUntil(uint256 timestamp) external onlyOwner {
        unlockTimestamp = timestamp;
        emit VaultLocked(timestamp);
    }

    function approveUnlock() external onlyApprover {
        require(block.timestamp >= unlockTimestamp, "Vault still locked");
        require(!hasApproved[msg.sender], "Already approved");
        hasApproved[msg.sender] = true;
        emit ApprovalGranted(msg.sender);

        if (getApprovalCount() >= approvalsRequired) {
            emit VaultUnlocked();
        }
    }

    function withdraw(address to, uint256 amount) external onlyOwner {
        require(block.timestamp >= unlockTimestamp, "Vault is locked");
        require(getApprovalCount() >= approvalsRequired, "Not enough approvals");
        require(token.transfer(to, amount), "Transfer failed");
        emit Withdrawn(to, amount);
    }

    function isApprover(address user) public view returns (bool) {
        for (uint256 i = 0; i < approvers.length; i++) {
            if (approvers[i] == user) return true;
        }
        return false;
    }

    function getApprovalCount() public view returns (uint256 count) {
        for (uint256 i = 0; i < approvers.length; i++) {
            if (hasApproved[approvers[i]]) count++;
        }
    }
}
