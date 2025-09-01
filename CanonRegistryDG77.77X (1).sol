// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/access/AccessControl.sol";

/**
 * @title CanonRegistryDG77X
 * @dev Contract for storing and updating a canonical hash.
 * Only accounts with the SGAU_ROLE may update the hash.
 */
contract CanonRegistryDG77X is AccessControl {
    bytes32 private canonHash;
    bytes32 public constant SGAU_ROLE = keccak256("SGAU_ROLE");

    /**
     * @dev Emitted when the canon hash is updated.
     */
    event CanonHashUpdated(bytes32 indexed oldHash, bytes32 indexed newHash);

    /**
     * @dev Constructor sets the initial canon hash and assigns admin roles.
     * @param initialCanonHash The initial canonical hash to store.
     */
    constructor(bytes32 initialCanonHash) {
        canonHash = initialCanonHash;
        _grantRole(DEFAULT_ADMIN_ROLE, msg.sender);
        _grantRole(SGAU_ROLE, msg.sender);
    }

    /**
     * @dev Updates the canonical hash. Callable only by accounts with SGAU_ROLE.
     * @param newHash The new canonical hash to store.
     */
    function updateCanonHash(bytes32 newHash) external onlyRole(SGAU_ROLE) {
        bytes32 oldHash = canonHash;
        canonHash = newHash;
        emit CanonHashUpdated(oldHash, newHash);
    }

    /**
     * @dev Returns the current canonical hash.
     * @return The stored canonical hash.
     */
    function currentCanonHash() external view returns (bytes32) {
        return canonHash;
    }
}