// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

/// @title ValorAiPlusToken — Official VALOR AI+ ERC20 (canonical)
contract ValorAiPlusToken is ERC20 {
    constructor(string memory name_, string memory symbol_, uint256 initialSupplyWei) ERC20(name_, symbol_) {
        _mint(msg.sender, initialSupplyWei);
    }
}
