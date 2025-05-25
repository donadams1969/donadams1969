// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/access/Ownable.sol";

contract ValorDAO is Ownable {
    mapping(address => bool) public voters;
    mapping(uint256 => string) public proposals;

    uint256 public proposalCount;

    event ProposalCreated(uint256 indexed proposalId, string description);
    event Voted(address indexed voter, uint256 proposalId);

    function addVoter(address voter) external onlyOwner {
        voters[voter] = true;
    }

    function createProposal(string calldata description) external onlyOwner {
        proposalCount++;
        proposals[proposalCount] = description;
        emit ProposalCreated(proposalCount, description);
    }

    function vote(uint256 proposalId) external {
        require(voters[msg.sender], "Not authorized to vote");
        emit Voted(msg.sender, proposalId);
    }
}