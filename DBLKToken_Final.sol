
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

/**
 * @title DBLK Anti-Short Reflex Token
 * @dev Implements short-resistant mechanics powered by VALOR AI+
 */

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract DBLKToken is ERC20, Ownable {
    uint256 public sellTaxRate = 5;
    uint256 public highRiskSellTaxRate = 15;
    mapping(address => bool) public flaggedShorters;

    constructor() ERC20("DBLK Anti-Short", "DBLK") {
        _mint(msg.sender, 1_000_000 * 10 ** decimals());
    }

    function transfer(address to, uint256 amount) public override returns (bool) {
        uint256 taxRate = flaggedShorters[msg.sender] ? highRiskSellTaxRate : sellTaxRate;
        uint256 tax = amount * taxRate / 100;
        uint256 amountAfterTax = amount - tax;

        _burn(msg.sender, tax);
        return super.transfer(to, amountAfterTax);
    }

    function flagShorter(address addr, bool status) external onlyOwner {
        flaggedShorters[addr] = status;
    }

    function updateSellTaxRate(uint256 newRate) external onlyOwner {
        sellTaxRate = newRate;
    }

    function updateHighRiskSellTaxRate(uint256 newRate) external onlyOwner {
        highRiskSellTaxRate = newRate;
    }
}
