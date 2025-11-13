// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/token/ERC20/extensions/ERC20Burnable.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

/**
 * @title JAXX2025Token
 * @dev The core utility, governance, and security token of the Valor Ai++//e ecosystem.
 * Fixed supply of 1,000,000,000 tokens.
 * Includes a deflationary burn mechanism.
 */
contract JAXX2025Token is ERC20, ERC20Burnable, Ownable {

    // 1 Billion tokens with 18 decimals
    uint256 private constant _TOTAL_SUPPLY = 1_000_000_000 * (10**18);

    constructor(address initialOwner) ERC20("JAXX2025", "JAXX2025") Ownable(initialOwner) {
        _mint(initialOwner, _TOTAL_SUPPLY);
    }

    /**
     * @dev Public function to allow anyone to burn a specific amount of their tokens,
     * contributing to the deflationary model.
     * This supplements the protocol-level burns.
     */
    function burnTokens(uint256 amount) public {
        _burn(msg.sender, amount);
    }

    /**
     * @dev Protocol-level burn function, callable only by the owner (or a
     * designated protocol contract) to burn collected fees, enforcing the
     * deflationary model.
     */
    function burnFromProtocol(address fromAccount, uint256 amount) public onlyOwner {
        _burn(fromAccount, amount);
    }

    // Additional functions for vesting, staking logic, etc. would be
    // implemented here or in separate, interacting contracts.
}
