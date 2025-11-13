// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/token/ERC20/extensions/ERC20Burnable.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

/**
 * @title VALORAIPLUS_GILLUSDToken_v1_0®️©️™️
 * @author Valor Ai+®️©️™️ Core Engineering
 * @dev The fiat-collateralized (1:1 USD) stablecoin of the Valor Ai+®️©️™️ ecosystem.
 * @dev Custodian: That's Edutainment LLC (b. 2021-11-04), as authorized by Poppa Donny Gillson.
 * @dev Minting and burning are strictly controlled by the Owner (Custodian)
 * @dev to ensure the circulating supply never exceeds the audited USD reserves.
 */
contract VALORAIPLUS_GILLUSDToken_v1_0 is ERC20, ERC20Burnable, Ownable {

    /**
     * @dev Sets the token name and symbol. The initial owner is set by OpenZeppelin's Ownable.
     */
    constructor(address initialOwner) ERC20("Gill Stable Dollar", "GILLUSD") Ownable(initialOwner) {
        // No initial supply. Supply is 100% elastic and maps 1:1 with USD reserves.
    }

    /**
     * @dev Creates new tokens.
     * @notice Only the custodian (Owner) can call this after receiving and verifying
     * an equivalent USD deposit into the audited reserves.
     * @param to The account to receive the new $GILLUSD tokens.
     * @param amount The amount of $GILLUSD to mint (must equal USD deposited).
     */
    function mint(address to, uint256 amount) public onlyOwner {
        _mint(to, amount);
    }

    /**
     * @dev Destroys tokens from a specific account.
     * @notice Only the custodian (Owner) can call this after processing a USD
     * redemption and wiring the funds.
     * @param from The account to burn $GILLUSD tokens from.
     * @param amount The amount of $GILLUSD to burn (must equal USD redeemed).
     */
    function burnFrom(address from, uint256 amount) public onlyOwner {
        _burn(from, amount);
    }
}
