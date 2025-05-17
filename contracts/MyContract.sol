// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import "@openzeppelin/contracts/access/Ownable.sol";

/// @title VALOR Case Registry v2 (A+ Edition)
/// @notice Enhanced registry with admin roles, gas optimizations, and user management
contract ValorCaseRegistry is Ownable {
    // --- ENUMS ---
    /// @notice Legal case status lifecycle
    enum CaseStatus { Filed, Reviewed, InProgress, Closed, Rejected }

    // --- STATE VARIABLES ---
    mapping(address => bool) public registeredUsers;
    mapping(address => string) public userSignatures;
    mapping(address => uint256) private userNonce;
    mapping(bytes32 => CaseRecord) private cases;
    mapping(address => bytes32[]) private userCaseIds;

    // --- STRUCTS ---
    struct CaseRecord {
        bytes32 id;
        string ipfsHash;
        bytes32 caseType;
        address filer;
        uint256 timestamp;
        CaseStatus status;
    }

    // --- EVENTS ---
    event CaseFiled(
        bytes32 indexed caseId,
        bytes32 indexed caseType,
        address indexed filer
    );

    event CaseStatusUpdated(
        bytes32 indexed caseId,
        CaseStatus newStatus
    );

    // --- USER MANAGEMENT ---

    /// @notice Registers a new user with an optional alias
    function registerUser(string calldata signature) external {
        require(!registeredUsers[msg.sender], "Already registered");
        registeredUsers[msg.sender] = true;
        userSignatures[msg.sender] = signature;
    }

    /// @notice Updates the caller's signature alias
    function updateSignature(string calldata newSignature) external {
        require(registeredUsers[msg.sender], "Not registered");
        userSignatures[msg.sender] = newSignature;
    }

    /// @notice Deregisters the caller, removing their signature
    function deregisterUser() external {
        require(registeredUsers[msg.sender], "Not registered");
        registeredUsers[msg.sender] = false;
        delete userSignatures[msg.sender];
    }

    // --- CASE OPERATIONS ---

    /// @notice Files a new legal case
    /// @param ipfsHash IPFS CID of the complaint document
    /// @param caseType 32-byte identifier (e.g., bytes32("ADA"))
    function fileCase(
        string calldata ipfsHash,
        bytes32 caseType
    ) external {
        require(registeredUsers[msg.sender], "Register first");

        // Unique ID: user + nonce + IPFS hash
        bytes32 caseId = keccak256(
            abi.encodePacked(msg.sender, userNonce[msg.sender], ipfsHash)
        );
        userNonce[msg.sender]++;

        // Store record
        cases[caseId] = CaseRecord({
            id: caseId,
            ipfsHash: ipfsHash,
            caseType: caseType,
            filer: msg.sender,
            timestamp: block.timestamp,
            status: CaseStatus.Filed
        });

        userCaseIds[msg.sender].push(caseId);
        emit CaseFiled(caseId, caseType, msg.sender);
    }

    /// @notice Updates the status of a case (by filer or admin)
    function updateCaseStatus(bytes32 caseId, CaseStatus newStatus) external {
        CaseRecord storage rec = cases[caseId];
        require(rec.timestamp != 0, "Case not found");
        require(
            msg.sender == rec.filer || msg.sender == owner(),
            "Unauthorized"
        );

        rec.status = newStatus;
        emit CaseStatusUpdated(caseId, newStatus);
    }

    // --- VIEW FUNCTIONS ---

    /// @notice Retrieves detailed case info
    function getCase(bytes32 caseId)
        external
        view
        returns (
            string memory ipfsHash,
            bytes32 caseType,
            string memory signature,
            address filer,
            uint256 timestamp,
            CaseStatus status
        )
    {
        CaseRecord storage rec = cases[caseId];
        require(rec.timestamp != 0, "Not exists");

        return (
            rec.ipfsHash,
            rec.caseType,
            userSignatures[rec.filer],
            rec.filer,
            rec.timestamp,
            rec.status
        );
    }

    /// @notice Returns all case IDs for a user
    function getUserCases(address user)
        external
        view
        returns (bytes32[] memory)
    {
        return userCaseIds[user];
    }

    /// @notice Paginates through a user's cases to avoid gas issues
    function getUserCasesInRange(
        address user,
        uint256 start,
        uint256 count
    ) external view returns (bytes32[] memory) {
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
}
