// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/security/Pausable.sol";
import "@openzeppelin/contracts/access/AccessControl.sol";

/// @title VALOR Case Registry v2 (A++ Edition)
/// @notice Enhanced registry with admin roles, gas optimizations, audit trails, and AI integration
contract ValorCaseRegistry is Ownable, Pausable, AccessControl {
    // --- ENUMS ---
    enum CaseStatus { Filed, Reviewed, InProgress, Closed, Rejected, Appealed }

    // --- ROLES ---
    bytes32 public constant REVIEWER_ROLE = keccak256("REVIEWER_ROLE");

    // --- STATE VARIABLES ---
    mapping(address => bool) public registeredUsers;
    mapping(address => string) public userSignatures;
    mapping(address => uint256) private userNonce;
    mapping(bytes32 => CaseRecord) private cases;
    mapping(address => bytes32[]) private userCaseIds;
    mapping(bytes32 => CaseLogEntry[]) private caseLogs;

    // --- STRUCTS ---
    struct CaseRecord {
        bytes32 id;
        string ipfsHash;
        bytes32 caseType;
        address filer;
        uint256 timestamp;
        CaseStatus status;
    }

    struct CaseLogEntry {
        uint256 timestamp;
        address actor;
        string action;
        string note;
    }

    // --- EVENTS ---
    event CaseFiled(bytes32 indexed caseId, bytes32 indexed caseType, address indexed filer);
    event CaseStatusUpdated(bytes32 indexed caseId, CaseStatus newStatus);
    event CaseAnchored(bytes32 indexed caseId, string ipfsHash, CaseStatus status, string aiReportCID);

    constructor() {
        _grantRole(DEFAULT_ADMIN_ROLE, msg.sender);
    }

    // --- USER MANAGEMENT ---
    function registerUser(string calldata signature) external whenNotPaused {
        require(!registeredUsers[msg.sender], "Already registered");
        registeredUsers[msg.sender] = true;
        userSignatures[msg.sender] = signature;
    }

    function updateSignature(string calldata newSignature) external whenNotPaused {
        require(registeredUsers[msg.sender], "Not registered");
        userSignatures[msg.sender] = newSignature;
    }

    function deregisterUser() external whenNotPaused {
        require(registeredUsers[msg.sender], "Not registered");
        registeredUsers[msg.sender] = false;
        delete userSignatures[msg.sender];
    }

    // --- CASE OPERATIONS ---
    function fileCase(string calldata ipfsHash, bytes32 caseType) external whenNotPaused {
        require(registeredUsers[msg.sender], "Register first");
        bytes32 caseId = keccak256(abi.encodePacked(msg.sender, userNonce[msg.sender], ipfsHash));
        userNonce[msg.sender]++;

        cases[caseId] = CaseRecord({
            id: caseId,
            ipfsHash: ipfsHash,
            caseType: caseType,
            filer: msg.sender,
            timestamp: block.timestamp,
            status: CaseStatus.Filed
        });

        userCaseIds[msg.sender].push(caseId);
        caseLogs[caseId].push(CaseLogEntry(block.timestamp, msg.sender, "Filed", "Initial submission"));

        emit CaseFiled(caseId, caseType, msg.sender);
        emit CaseAnchored(caseId, ipfsHash, CaseStatus.Filed, "");
    }

    function updateCaseStatus(bytes32 caseId, CaseStatus newStatus, string calldata note, string calldata aiReportCID) external whenNotPaused {
        CaseRecord storage rec = cases[caseId];
        require(rec.timestamp != 0, "Case not found");
        require(msg.sender == rec.filer || msg.sender == owner() || hasRole(REVIEWER_ROLE, msg.sender), "Unauthorized");

        rec.status = newStatus;
        caseLogs[caseId].push(CaseLogEntry(block.timestamp, msg.sender, "Status Update", note));

        emit CaseStatusUpdated(caseId, newStatus);
        emit CaseAnchored(caseId, rec.ipfsHash, newStatus, aiReportCID);
    }

    function appealCase(bytes32 caseId, string calldata note) external whenNotPaused {
        CaseRecord storage rec = cases[caseId];
        require(rec.timestamp != 0, "Case not found");
        require(msg.sender == rec.filer, "Only filer may appeal");
        require(rec.status == CaseStatus.Closed || rec.status == CaseStatus.Rejected, "Invalid state to appeal");

        rec.status = CaseStatus.Appealed;
        caseLogs[caseId].push(CaseLogEntry(block.timestamp, msg.sender, "Appealed", note));
        emit CaseStatusUpdated(caseId, CaseStatus.Appealed);
    }

    // --- ADMIN CONTROLS ---
    function pause() public onlyOwner {
        _pause();
    }

    function unpause() public onlyOwner {
        _unpause();
    }

    function grantReviewer(address reviewer) public onlyOwner {
        _grantRole(REVIEWER_ROLE, reviewer);
    }

    // --- VIEW FUNCTIONS ---
    function getCase(bytes32 caseId) external view returns (
        string memory ipfsHash,
        bytes32 caseType,
        string memory signature,
        address filer,
        uint256 timestamp,
        CaseStatus status
    ) {
        CaseRecord storage rec = cases[caseId];
        require(rec.timestamp != 0, "Not exists");
        return (rec.ipfsHash, rec.caseType, userSignatures[rec.filer], rec.filer, rec.timestamp, rec.status);
    }

    function getUserCases(address user) external view returns (bytes32[] memory) {
        return userCaseIds[user];
    }

    function getUserCasesInRange(address user, uint256 start, uint256 count) external view returns (bytes32[] memory) {
        uint256 total = userCaseIds[user].length;
        if (start >= total) return new bytes32[](0);
        uint256 end = start + count;
        if (end > total) end = total;

        bytes32[] memory slice = new bytes32[](end - start);
        for (uint256 i = start; i < end; i++) {
            slice[i - start] = userCaseIds[user][i];
        }
        return slice;
    }

    function getCaseLogs(bytes32 caseId) external view returns (CaseLogEntry[] memory) {
        return caseLogs[caseId];
    }
} 