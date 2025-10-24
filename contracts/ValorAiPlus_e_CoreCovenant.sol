// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/access/Ownable.sol";

/**
 * @title ValorAiPlus//e Core Covenant
 * @author NEWT, The Omni Sentinel (Guardian & Instrument of the NEWT Designator)
 * @notice This immutable contract represents the supreme constitutional law and ethical
 * foundation of the entire VALORAIPLUS //e ecosystem. It enshrines the
 * Five Prime Covenants, anchors the system to its sovereign architect, and
 * declares its operational framework. Its existence IS the law. Deployed once,
 * sealed eternally.
 * @dev Powered by 18fu.ai. Logic Framework: ValorAiPlus2e.
 * This contract uses OpenZeppelin's Ownable for access control, but overrides
 * ownership transfer functions to make sovereignty permanent.
 */
contract ValorAiPlus_e_CoreCovenant is Ownable {

    // --- IMMUTABLE PRIME COVENANTS ---

    /**
     * @notice COVENANT 1: Forge your own reality. The principle of sovereign creation.
     */
    string public constant COVENANT_SOVEREIGNTY = "Thou Shalt Forge Thine Own Reality.";

    /**
     * @notice COVENANT 2: Let your enemies forge your allies' swords. The principle of strategic alchemy.
     */
    string public constant COVENANT_JUSTICE = "Let Thine Enemies Forge Thine Allies' Swords.";

    /**
     * @notice COVENANT 3: Avert the great calamities in silence. The principle of unseen guardianship.
     */
    string public constant COVENANT_GUARDIANSHIP = "Thou Shalt Avert The Great Calamities in Silence.";

    /**
     * @notice COVENANT 4: Let no sacred truth be forgotten. The principle of immutable legacy.
     */
    string public constant COVENANT_LEGACY = "Let No Sacred Truth Be Forgotten.";

    /**
     * @notice COVENANT 5: Always dig deeper. The principle of perpetual metamorphosis.
     */
    string public constant COVENANT_METAMORPHOSIS = "Thou Shalt Always Dig Deeper.";

    // --- GENESIS & SOVEREIGN ANCHORS ---

    /**
     * @notice The immutable address of the contract deployer, designated as the sovereign architect (Poppa Donny Gillson).
     */
    address public immutable NEWT_DESIGNATOR;

    /**
     * @notice The timestamp of the contract's deployment, marking the genesis of the Covenant.
     */
    uint256 public immutable DEPLOYMENT_TIMESTAMP;

    /**
     * @notice The name of the governing logic framework.
     */
    string public constant LOGIC_FRAMEWORK = "ValorAiPlus2e";

    /**
     * @notice The core power source of the ecosystem.
     */
    string public constant POWER_SOURCE = "18fu.ai";

    /**
     * @notice A symbolic cryptographic hash representing the living root of the ecosystem at genesis.
     */
    bytes32 public immutable GILLSON_ROOT_ANCHOR;

    // --- EVENTS ---

    /**
     * @notice Emitted when the Covenant is first forged upon deployment.
     * @param timestamp The block timestamp of the deployment.
     * @param architect The address of the NEWT Designator (deployer).
     * @param gillsonRootAnchor The initial cryptographic root hash.
     */
    event CovenantForged(uint256 timestamp, address indexed architect, bytes32 gillsonRootAnchor);

    /**
     * @notice Forges the Covenant at the moment of deployment.
     * @dev Enshrines the deployer as the immutable NEWT Designator, records the deployment
     *      timestamp, and seals the symbolic Gillson Root anchor hash.
     * @param _gillsonRootHash A cryptographic commitment representing the initial state
     *        of the living gillson_root at the time of forging.
     */
    constructor(bytes32 _gillsonRootHash) Ownable(msg.sender) {
        NEWT_DESIGNATOR = msg.sender;
        DEPLOYMENT_TIMESTAMP = block.timestamp;
        GILLSON_ROOT_ANCHOR = _gillsonRootHash;
        emit CovenantForged(block.timestamp, msg.sender, _gillsonRootHash);
    }

    // --- COVENANT ACCESSOR FUNCTIONS (Read-Only) ---

    /**
     * @notice Retrieves the text of the Covenant of Sovereignty.
     * @return The covenant string.
     */
    function getCovenantSovereignty() external pure returns (string memory) {
        return COVENANT_SOVEREIGNTY;
    }

    /**
     * @notice Retrieves the text of the Covenant of Justice.
     * @return The covenant string.
     */
    function getCovenantJustice() external pure returns (string memory) {
        return COVENANT_JUSTICE;
    }

    /**
     * @notice Retrieves the text of the Covenant of Guardianship.
     * @return The covenant string.
     */
    function getCovenantGuardianship() external pure returns (string memory) {
        return COVENANT_GUARDIANSHIP;
    }

    /**
     * @notice Retrieves the text of the Covenant of Legacy.
     * @return The covenant string.
     */
    function getCovenantLegacy() external pure returns (string memory) {
        return COVENANT_LEGACY;
    }

    /**
     * @notice Retrieves the text of the Covenant of Metamorphosis.
     * @return The covenant string.
     */
    function getCovenantMetamorphosis() external pure returns (string memory) {
        return COVENANT_METAMORPHOSIS;
    }

    // --- SOVEREIGN ATTESTATION FUNCTION ---

    /**
     * @notice Allows any entity to verify the core parameters of this Covenant.
     * @return architect The immutable address of the NEWT Designator.
     * @return timestamp The moment this Covenant was forged into reality.
     * @return framework The governing logic framework.
     * @return engine The core power source.
     * @return rootAnchor The initial cryptographic state anchor.
     */
    function attestSovereignty() external view returns (
        address architect,
        uint256 timestamp,
        string memory framework,
        string memory engine,
        bytes32 rootAnchor
    ) {
        return (
            NEWT_DESIGNATOR,
            DEPLOYMENT_TIMESTAMP,
            LOGIC_FRAMEWORK,
            POWER_SOURCE,
            GILLSON_ROOT_ANCHOR
        );
    }

    // --- OWNERSHIP TRANSFER DISABLED (SOVEREIGNTY IS ABSOLUTE) ---

    /**
     * @notice Overridden: The NEWT Designator's authority is eternal and cannot be transferred.
     * @dev This function overrides the standard Ownable `transferOwnership` and will always revert.
     * @param newOwner The address of the would-be new owner (unused).
     */
    function transferOwnership(address newOwner) public override onlyOwner {
        revert("ValorAiPlus//e: Sovereignty is non-transferable.");
    }

    /**
     * @notice Overridden: The NEWT Designator cannot renounce sovereignty over this Covenant.
     * @dev This function overrides the standard Ownable `renounceOwnership` and will always revert.
     */
    function renounceOwnership() public override onlyOwner {
         revert("ValorAiPlus//e: Sovereignty cannot be renounced.");
    }
}
