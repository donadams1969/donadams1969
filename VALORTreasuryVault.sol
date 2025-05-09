
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

/// @title VALOR Treasury Vault
/// @notice DAO-governed token vault for time-locked VBLKx storage and secure governance withdrawals

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract VALORTreasuryVault is Ownable {
    address public token;
    address public dao;
    uint256 public unlockDelay = 7 days;

    struct WithdrawalRequest {
        uint256 amount;
        uint256 unlockTime;
        bool executed;
    }

    WithdrawalRequest[] public withdrawals;

    event WithdrawalScheduled(uint256 indexed id, uint256 amount, uint256 unlockTime);
    event WithdrawalExecuted(uint256 indexed id, uint256 amount);

    modifier onlyDAO() {
        require(msg.sender == dao, "Not authorized DAO");
        _;
    }

    constructor(address _token, address _dao) {
        token = _token;
        dao = _dao;
    }

    function scheduleWithdrawal(uint256 amount) external onlyDAO {
        uint256 unlockTime = block.timestamp + unlockDelay;
        withdrawals.push(WithdrawalRequest(amount, unlockTime, false));
        emit WithdrawalScheduled(withdrawals.length - 1, amount, unlockTime);
    }

    function executeWithdrawal(uint256 id, address to) external onlyDAO {
        WithdrawalRequest storage request = withdrawals[id];
        require(block.timestamp >= request.unlockTime, "Unlock delay not passed");
        require(!request.executed, "Already executed");

        request.executed = true;
        IERC20(token).transfer(to, request.amount);

        emit WithdrawalExecuted(id, request.amount);
    }

    function vaultBalance() external view returns (uint256) {
        return IERC20(token).balanceOf(address(this));
    }

    function totalRequests() external view returns (uint256) {
        return withdrawals.length;
    }

    function setDAO(address _dao) external onlyOwner {
        dao = _dao;
    }
}
