// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract AAEE77Ethics {
    mapping(address => bool) public trustedSubmitters;
    mapping(bytes32 => string) public ethicalRules;

    modifier onlyTrusted() {
        require(trustedSubmitters[msg.sender], "Not authorized.");
        _;
    }

    constructor() {
        trustedSubmitters[msg.sender] = true;
    }

    function addEthicalRule(bytes32 ruleId, string memory ruleText) public onlyTrusted {
        ethicalRules[ruleId] = ruleText;
    }

    function getRule(bytes32 ruleId) public view returns (string memory) {
        return ethicalRules[ruleId];
    }
}