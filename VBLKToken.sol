
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

/// @title VBLK Token - Valor Blockchain Utility Token
/// @notice Immutable utility token for VALORCHAIN ecosystem.
/// @author Donny Adams
/// @gateway https://www.18fu.cash

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract VBLKToken is ERC20, Ownable {
    constructor() ERC20("Valor Blockchain Token", "VBLK") {
        _mint(msg.sender, 100_000_000 * 10 ** decimals()); // Initial Supply: 100M VBLK
    }

    function mint(address to, uint256 amount) public onlyOwner {
        _mint(to, amount);
    }

    function burn(uint256 amount) public {
        _burn(msg.sender, amount);
    }
}
