// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract VALOR_Sim {
    address public owner;

    enum Role { Unknown, Judge, Lawyer, Defendant }

    struct LegalProfile {
        string name;
        Role role;
        uint256 riskScore;
        uint256 lastUpdated;
    }

    mapping(address => LegalProfile) public profiles;
    mapping(address => bool) public authorizedAnalysts;

    event ProfileCreated(address indexed user, string name, Role role);
    event RiskUpdated(address indexed user, uint256 riskScore);

    modifier onlyOwner() {
        require(msg.sender == owner, "Not owner");
        _;
    }

    modifier onlyAnalyst() {
        require(authorizedAnalysts[msg.sender], "Not authorized");
        _;
    }

    constructor() {
        owner = msg.sender;
        authorizedAnalysts[msg.sender] = true;
    }

    function authorizeAnalyst(address analyst, bool status) external onlyOwner {
        authorizedAnalysts[analyst] = status;
    }

    function registerProfile(address user, string calldata name, Role role) external onlyAnalyst {
        profiles[user] = LegalProfile(name, role, 0, block.timestamp);
        emit ProfileCreated(user, name, role);
    }

    function updateRiskScore(address user, uint256 newScore) external onlyAnalyst {
        require(bytes(profiles[user].name).length > 0, "Profile not found");
        profiles[user].riskScore = newScore;
        profiles[user].lastUpdated = block.timestamp;
        emit RiskUpdated(user, newScore);
    }

    function getProfile(address user) external view returns (string memory, Role, uint256, uint256) {
        LegalProfile memory p = profiles[user];
        return (p.name, p.role, p.riskScore, p.lastUpdated);
    }
}