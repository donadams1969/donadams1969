// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

/* ====================================================================
   VALORAIPLUS® SOVEREIGN CORE — v7.77X-Ξ
   COPYRIGHT © 2025 VALORAIPLUS. ALL RIGHTS RESERVED.

   COMMANDER: DG77.77X-Ξ (Poppa Donny Gillson)
   LOCATION: SAINT PAUL GENESIS NODE™️
   ECOSYSTEM: VALORCHAIN® / $GILLGOLD / $DONNY

   This contract is the immutable law of the Valor Ecosystem.
   It manages:
   1. The $1 Sextillion Valuation Peg
   2. The Sovereign Bond (ERC721)
   3. C3PAO On-Chain Verification
   4. Autopilot Access Controls
   ==================================================================== */

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/access/AccessControl.sol";
import "@openzeppelin/contracts/utils/Strings.sol";

contract VALOR_SOVEREIGN_CORE is ERC721, ERC721URIStorage, AccessControl {
    using Strings for uint256;

    // --- ROLES ---
    bytes32 public constant COMMANDER_ROLE = keccak256("COMMANDER_ROLE");
    bytes32 public constant JULES_AUTOPILOT_ROLE = keccak256("JULES_AUTOPILOT_ROLE");

    // --- VALUATION CONSTANTS (AMATH) ---
    // 1 Sextillion = 10^21.
    uint256 public constant VALUATION_PEG_USD = 1_000_000_000_000_000_000_000;
    string public constant ISSUER_LEGAL = unicode"VALORAIPLUS® SOVEREIGN TREASURY";
    string public constant LOCATION_NODE = unicode"SAINT PAUL GENESIS NODE™️";

    // --- C3PAO REGISTRY ---
    // Maps a document hash (Merkleroot) to its verification status and timestamp
    struct VerificationSeal {
        bool isValid;
        uint256 timestamp;
        string documentType;
        address verifier;
    }
    mapping(bytes32 => VerificationSeal) public c3paoRegistry;

    // --- STATE VARIABLES ---
    uint256 private _nextTokenId;
    bool public emergencyLockdown;

    // --- EVENTS ---
    event SovereignBondMinted(uint256 indexed tokenId, address indexed commander, uint256 valuation);
    event C3PAOVerified(bytes32 indexed docHash, string docType, uint256 timestamp);
    event EcosystemLockdown(bool status, uint256 timestamp);

    constructor(address _commanderAddress) ERC721("VALOR SOVEREIGN ASSETS", "VALOR") {
        _grantRole(DEFAULT_ADMIN_ROLE, _commanderAddress);
        _grantRole(COMMANDER_ROLE, _commanderAddress);
        _grantRole(JULES_AUTOPILOT_ROLE, msg.sender); // Initial deployer can be Jules

        emergencyLockdown = false;
        _nextTokenId = 1;
    }

    // =============================================================
    // 1. THE $1 SEXTILLION BOND (MINTING)
    // =============================================================

    /**
     * @dev Mints the unique Sovereign Bond Certificate on-chain.
     * Only the Commander can execute this.
     * The URI points to the SVG data or IPFS hash of Artifact A.
     */
    function mintSovereignBond(address to, string memory uri) public onlyRole(COMMANDER_ROLE) returns (uint256) {
        require(!emergencyLockdown, "SYSTEM LOCKED");

        uint256 tokenId = _nextTokenId++;
        _safeMint(to, tokenId);
        _setTokenURI(tokenId, uri);

        emit SovereignBondMinted(tokenId, to, VALUATION_PEG_USD);
        return tokenId;
    }

    // =============================================================
    // 2. C3PAO ON-CHAIN VERIFICATION
    // =============================================================

    /**
     * @dev Stacks a Merkleroot hash into the registry.
     * This creates the "Gold Seal" on the blockchain.
     */
    function registerC3PAOSeal(bytes32 docHash, string memory docType) public onlyRole(COMMANDER_ROLE) {
        require(!emergencyLockdown, "SYSTEM LOCKED");

        c3paoRegistry[docHash] = VerificationSeal({
            isValid: true,
            timestamp: block.timestamp,
            documentType: docType,
            verifier: msg.sender
        });

        emit C3PAOVerified(docHash, docType, block.timestamp);
    }

    /**
     * @dev Public function to verify if a hash is valid in the VALORCHAIN.
     */
    function verifyDocument(bytes32 docHash) public view returns (bool, uint256, string memory) {
        VerificationSeal memory seal = c3paoRegistry[docHash];
        return (seal.isValid, seal.timestamp, seal.documentType);
    }

    // =============================================================
    // 3. JULES AUTOPILOT & GOVERNANCE
    // =============================================================

    /**
     * @dev Toggles Emergency Protocol.
     * Stops all minting and writing if threat detected.
     */
    function toggleLockdown() public onlyRole(COMMANDER_ROLE) {
        emergencyLockdown = !emergencyLockdown;
        emit EcosystemLockdown(emergencyLockdown, block.timestamp);
    }

    // --- OVERRIDES FOR SOLIDITY COMPLIANCE ---
    function supportsInterface(bytes4 interfaceId) public view override(ERC721, ERC721URIStorage, AccessControl) returns (bool) {
        return super.supportsInterface(interfaceId);
    }

    function tokenURI(uint256 tokenId) public view override(ERC721, ERC721URIStorage) returns (string memory) {
        return super.tokenURI(tokenId);
    }
}