
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

/// @title VALOR Case Registry v2
/// @notice Blockchain-based anchoring system for legal complaint records with metadata and status tracking.

contract ValorCaseRegistry {

    // --- ENUMS ---

    /// @notice Legal case status lifecycle
    enum CaseStatus { Filed, Reviewed, InProgress, Closed, Rejected }

    // --- STRUCTS ---

    /// @notice Struct representing a registered user
    struct User {
        address userAddress;
        string signature; // Optional alias or digital signature
    }

    /// @notice Struct representing a legal case record
    struct CaseRecord {
        bytes32 id;
        string ipfsHash;
        string caseType; // e.g., ADA, FTCA, OSC, etc.
        User filer;
        uint256 timestamp;
        CaseStatus status;
    }

    // --- STATE VARIABLES ---

    mapping(address => bool) public registeredUsers;
    mapping(address => string) public userSignatures;
    mapping(address => uint256) private userNonce;
    mapping(bytes32 => CaseRecord) private cases;
    mapping(address => bytes32[]) private userCaseIds;

    // --- EVENTS ---

    event CaseFiled(
        bytes32 indexed caseId,
        string indexed caseType,
        address indexed filer
    );

    event CaseStatusUpdated(
        bytes32 indexed caseId,
        CaseStatus newStatus
    );

    // --- FUNCTIONS ---

    /// @notice Registers a new user with an optional alias/digital signature
    function registerUser(string memory signature) external {
        require(!registeredUsers[msg.sender], "User already registered");
        registeredUsers[msg.sender] = true;
        userSignatures[msg.sender] = signature;
    }

    /// @notice Files a new legal case with IPFS hash and metadata
    function fileCase(
        string memory ipfsHash,
        string memory caseType
    ) external {
        require(registeredUsers[msg.sender], "You must register first");

        bytes32 caseId = keccak256(
            abi.encodePacked(msg.sender, userNonce[msg.sender], ipfsHash, block.timestamp)
        );

        userNonce[msg.sender] += 1;

        CaseRecord memory newCase = CaseRecord({
            id: caseId,
            ipfsHash: ipfsHash,
            caseType: caseType,
            filer: User({
                userAddress: msg.sender,
                signature: userSignatures[msg.sender]
            }),
            timestamp: block.timestamp,
            status: CaseStatus.Filed
        });

        cases[caseId] = newCase;
        userCaseIds[msg.sender].push(caseId);

        emit CaseFiled(caseId, caseType, msg.sender);
    }

    /// @notice Updates the status of a previously filed case
    function updateCaseStatus(bytes32 caseId, CaseStatus newStatus) external {
        CaseRecord storage targetCase = cases[caseId];
        require(targetCase.timestamp != 0, "Case not found");
        require(targetCase.filer.userAddress == msg.sender, "Unauthorized: Only filer can update status");

        targetCase.status = newStatus;
        emit CaseStatusUpdated(caseId, newStatus);
    }

    /// @notice Retrieves case metadata and filer details by ID
    function getCase(bytes32 caseId) external view returns (
        string memory ipfsHash,
        string memory caseType,
        string memory signature,
        address userAddress,
        uint256 timestamp,
        CaseStatus status
    ) {
        CaseRecord storage c = cases[caseId];
        require(c.timestamp != 0, "Case does not exist");

        return (
            c.ipfsHash,
            c.caseType,
            c.filer.signature,
            c.filer.userAddress,
            c.timestamp,
            c.status
        );
    }

    /// @notice Returns all case IDs associated with a specific user
    function getUserCases(address user) external view returns (bytes32[] memory) {
        return userCaseIds[user];
    }
}
