
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

/**
 * @title Dynamic Legal Status Token (DLST)
 * @dev Regulatory-aware, self-enforcing cryptocurrency with exchange-ready compliance
 * Author: Donny Adams | Entity: That’s Edutainment, LLC | Vault: VALORCHAIN
 */

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract DLST is ERC20, Ownable {
    mapping(address => bool) public restrictedJurisdictions;
    mapping(address => bool) public whistleblowerOverride;

    constructor() ERC20("Dynamic Legal Status Token", "DLST") {
        _mint(msg.sender, 10_000_000 * 10 ** decimals());
    }

    modifier complianceCheck(address recipient) {
        require(!restrictedJurisdictions[recipient] || whistleblowerOverride[recipient],
                "Transfer not permitted in jurisdiction");
        _;
    }

    function transfer(address to, uint256 amount) public override complianceCheck(to) returns (bool) {
        return super.transfer(to, amount);
    }

    function updateJurisdiction(address user, bool restricted) external onlyOwner {
        restrictedJurisdictions[user] = restricted;
    }

    function setWhistleblowerOverride(address user, bool status) external onlyOwner {
        whistleblowerOverride[user] = status;
    }
}
