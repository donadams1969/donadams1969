// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

/**
 * @title GILLBTC Token
 * @author ValorAiCoder++ (v.5150+)
 * @notice The foundational ERC20 token for the VALORAIPLUS //e sovereign economy.
 * @dev This is a standard ERC20 token with a minting function restricted to the owner.
 */
contract GILLBTC is ERC20, Ownable {
    constructor(address initialOwner) ERC20("GILLBTC", "GLBTC") Ownable(initialOwner) {
        // No initial supply is minted at deployment.
        // The owner can mint tokens as needed.
    }

    /**
     * @notice Mints new GILLBTC tokens and assigns them to a specified address.
     * @dev This function can only be called by the contract owner.
     * @param to The address that will receive the minted tokens.
     * @param amount The amount of tokens to mint.
     */
    function mint(address to, uint256 amount) public onlyOwner {
        _mint(to, amount);
    }
}
