// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

contract VALORCHAINGPrimeValidator {
    /// @notice Checks if a number is prime.
    /// @param n The number to check.
    /// @return true if the number is prime, false otherwise.
    function isPrime(uint256 n) public pure returns (bool) {
        if (n <= 1) {
            return false;
        }
        if (n <= 3) {
            return true;
        }
        if (n % 2 == 0 || n % 3 == 0) {
            return false;
        }
        for (uint256 i = 5; i * i <= n; i = i + 6) {
            if (n % i == 0 || n % (i + 2) == 0) {
                return false;
            }
        }
        return true;
    }

    /// @notice Checks if a number is composite.
    /// @param n The number to check.
    /// @return true if the number is composite, false otherwise.
    function isComposite(uint256 n) public pure returns (bool) {
        require(n > 1, "Numbers <= 1 are not composite");
        return !isPrime(n);
    }
}