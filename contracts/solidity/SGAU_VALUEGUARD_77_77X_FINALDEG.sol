// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

/**
 * @title SGAU_VALUEGUARD_77_77X_FINALDEG
 * @dev Full authority-isolated constitutional publication runtime.
 * Law: No Evidence -> No Receipt -> No Continuity -> No Governance -> No Verdict -> No Snapshot -> No Projection
 */
contract SGAU_VALUEGUARD_77_77X_FINALDEG {

    // --- Roles ---
    address public owner;
    address public validator;
    address public publisher;
    address public governor;

    // --- State ---
    uint256 public constant TOTAL_FRAGMENTS = 15682;
    uint256 public receiptCount;
    uint256 public governanceCount;
    uint256 public verdictCount;

    bool public snapshotPublished;
    bytes32 public currentLineageHash;

    // --- Events ---
    event ReceiptGenerated(bytes32 indexed fragmentHash, uint256 count);
    event GovernanceContinuityLatched(bytes32 indexed governanceHash, uint256 count);
    event VerdictSealed(bytes32 indexed verdictHash, uint256 count);
    event SnapshotPublished(bytes32 indexed finalDigest);

    constructor(address _validator, address _publisher, address _governor) {
        owner = msg.sender;
        validator = _validator;
        publisher = _publisher;
        governor = _governor;
        currentLineageHash = keccak256(abi.encodePacked("GENESIS_BLOCK_77_77X"));
    }

    modifier onlyOwner() {
        require(msg.sender == owner, "Unauthorized: Owner only");
        _;
    }

    modifier onlyValidator() {
        require(msg.sender == validator, "Unauthorized: Validator only");
        _;
    }

    modifier onlyGovernor() {
        require(msg.sender == governor, "Unauthorized: Governor only");
        _;
    }

    modifier onlyPublisher() {
        require(msg.sender == publisher, "Unauthorized: Publisher only");
        _;
    }

    // --- Authority Domain ---

    function generateReceipt(bytes32 fragmentHash) external onlyValidator {
        require(receiptCount < TOTAL_FRAGMENTS, "Receipt capacity reached");

        currentLineageHash = keccak256(abi.encodePacked(currentLineageHash, fragmentHash, "RECEIPT"));
        receiptCount++;

        emit ReceiptGenerated(fragmentHash, receiptCount);
    }

    function latchGovernance(bytes32 governanceHash) external onlyGovernor {
        require(receiptCount == TOTAL_FRAGMENTS, "Receipt continuity not met");
        require(governanceCount < TOTAL_FRAGMENTS, "Governance capacity reached");

        currentLineageHash = keccak256(abi.encodePacked(currentLineageHash, governanceHash, "GOVERNANCE"));
        governanceCount++;

        emit GovernanceContinuityLatched(governanceHash, governanceCount);
    }

    function sealVerdict(bytes32 verdictHash) external onlyOwner {
        require(governanceCount == TOTAL_FRAGMENTS, "Governance continuity not met");
        require(verdictCount < TOTAL_FRAGMENTS, "Verdict capacity reached");

        currentLineageHash = keccak256(abi.encodePacked(currentLineageHash, verdictHash, "VERDICT"));
        verdictCount++;

        emit VerdictSealed(verdictHash, verdictCount);
    }

    function publishSnapshot() external onlyPublisher {
        require(verdictCount == TOTAL_FRAGMENTS, "Verdict continuity not met");
        require(!snapshotPublished, "Snapshot already published");

        snapshotPublished = true;

        emit SnapshotPublished(currentLineageHash);
    }

    // --- Visibility Domain ---

    function getRuntimeDigest() external view returns (
        uint256 receipts,
        uint256 governance,
        uint256 verdicts,
        bool isPublished,
        bytes32 lineage
    ) {
        return (receiptCount, governanceCount, verdictCount, snapshotPublished, currentLineageHash);
    }
}
