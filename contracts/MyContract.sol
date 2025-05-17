```solidity
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/security/Pausable.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";
import "@openzeppelin/contracts/access/AccessControlEnumerable.sol";
import "@openzeppelin/contracts/utils/cryptography/ECDSA.sol";
import "@openzeppelin/contracts/utils/introspection/ERC165.sol";

/// @title VALOR Case Registry v3 (Improved)
/// @notice Enterprise-grade case management with AI integration, temporal controls, and gas optimizations
contract ValorCaseRegistry is
    Ownable,
    Pausable,
    ReentrancyGuard,
    AccessControlEnumerable,
    ERC165
{
    using ECDSA for bytes32;

    // --- ENUMS ---
    enum CaseStatus { Filed, Reviewed, InProgress, Closed, Rejected, Appealed, Expired }

    // --- ROLES ---
    bytes32 public constant REVIEWER_ROLE = keccak256("REVIEWER_ROLE");
    bytes32 public constant AI_ORACLE   = keccak256("AI_ORACLE");

    // --- STATE ---
    mapping(address => bool) public registeredUsers;
    mapping(address => bytes) public userSignatures;
    mapping(address => uint256) private userNonce;
    mapping(bytes32 => CaseRecord) private cases;
    mapping(address => bytes32[]) private userCaseIds;
    mapping(bytes32 => uint256) public caseExpirations;
    mapping(bytes32 => string) private aiReports;
    mapping(address => mapping(CaseStatus => uint256)) public userCaseCounts;

    // --- STRUCTS ---
    struct CaseRecord {
        bytes32    id;
        string     ipfsHash;
        bytes32    caseType;
        address    filer;
        uint256    timestamp;
        CaseStatus status;
        bytes32    signatureHash;
    }

    // --- EVENTS ---
    event CaseFiled(
        bytes32 indexed caseId,
        bytes32 indexed caseType,
        address indexed filer
    );
    event CaseStatusUpdated(
        bytes32 indexed caseId,
        CaseStatus indexed oldStatus,
        CaseStatus indexed newStatus,
        string note,
        string aiReportCID
    );
    event CaseExpired(bytes32 indexed caseId);
    event SignatureVerified(address indexed user);
    event AIReportStored(bytes32 indexed caseId, string cid);
    event LogEntry(
        bytes32 indexed caseId,
        address indexed actor,
        string action,
        string note,
        string cid
    );

    // --- MODIFIERS ---
    modifier onlyActiveUser() {
        require(registeredUsers[msg.sender], "User not registered");
        _;
    }

    modifier checkExpiration(bytes32 caseId) {
        uint256 exp = caseExpirations[caseId];
        if (exp != 0 && block.timestamp > exp) {
            _expireCase(caseId);
        }
        _;
    }

    constructor() {
        _grantRole(DEFAULT_ADMIN_ROLE, msg.sender);
        _grantRole(AI_ORACLE, msg.sender);
    }

    // --- PAUSE CONTROL ---
    function pause() external onlyOwner {
        _pause();
    }

    function unpause() external onlyOwner {
        _unpause();
    }

    // --- USER MANAGEMENT ---
    function registerUser(bytes calldata signature)
        external
        whenNotPaused
        nonReentrant
    {
        require(!registeredUsers[msg.sender], "Already registered");

        bytes32 msgHash = keccak256(abi.encodePacked(msg.sender));
        address signer = msgHash.toEthSignedMessageHash().recover(signature);
        require(signer == msg.sender, "Invalid signature");

        registeredUsers[msg.sender] = true;
        userSignatures[msg.sender] = signature;

        emit SignatureVerified(msg.sender);
        emit LogEntry(0, msg.sender, "Register", "", "");
    }

    function deregisterUser()
        external
        onlyActiveUser
        nonReentrant
    {
        delete userCaseIds[msg.sender];
        registeredUsers[msg.sender] = false;
        delete userSignatures[msg.sender];

        emit LogEntry(0, msg.sender, "Deregister", "", "");
    }

    // --- CASE OPERATIONS ---
    function fileCase(
        string calldata ipfsHash,
        bytes32    caseType,
        bytes32    signatureHash
    )
        external
        onlyActiveUser
        whenNotPaused
        nonReentrant
        returns (bytes32)
    {
        bytes32 caseId = keccak256(
            abi.encodePacked(msg.sender, userNonce[msg.sender]++, signatureHash)
        );

        cases[caseId] = CaseRecord({
            id:             caseId,
            ipfsHash:       ipfsHash,
            caseType:       caseType,
            filer:          msg.sender,
            timestamp:      block.timestamp,
            status:         CaseStatus.Filed,
            signatureHash:  signatureHash
        });

        userCaseIds[msg.sender].push(caseId);
        userCaseCounts[msg.sender][CaseStatus.Filed]++;

        emit CaseFiled(caseId, caseType, msg.sender);
        emit LogEntry(caseId, msg.sender, "Filed", "Initial submission", "");

        return caseId;
    }

    function updateCaseStatus(
        bytes32    caseId,
        CaseStatus newStatus,
        string     calldata note,
        string     calldata aiReportCID
    )
        external
        whenNotPaused
        nonReentrant
        checkExpiration(caseId)
    {
        CaseRecord storage rec = cases[caseId];
        require(rec.timestamp != 0, "Case not found");
        require(_isAuthorized(rec, msg.sender), "Unauthorized");
        require(_isValidTransition(rec.status, newStatus), "Invalid transition");

        CaseStatus oldStatus = rec.status;
        _updateStatusCounts(rec.filer, oldStatus, newStatus);
        rec.status = newStatus;

        if (bytes(aiReportCID).length > 0) {
            require(_isValidCID(aiReportCID), "Invalid CID format");
            aiReports[caseId] = aiReportCID;
            emit AIReportStored(caseId, aiReportCID);
        }

        emit CaseStatusUpdated(caseId, oldStatus, newStatus, note, aiReportCID);
        emit LogEntry(caseId, msg.sender, "Status Update", note, aiReportCID);
    }

    // --- TEMPORAL CONTROLS ---
    function setCaseExpiration(bytes32 caseId, uint256 duration)
        external
        onlyRole(REVIEWER_ROLE)
    {
        require(cases[caseId].timestamp != 0, "Case not found");
        caseExpirations[caseId] = block.timestamp + duration;
        emit LogEntry(caseId, msg.sender, "Set Expiration", "", "");
    }

    // --- AI INTEGRATION ---
    function storeAIReport(bytes32 caseId, string calldata cid)
        external
        onlyRole(AI_ORACLE)
        nonReentrant
    {
        require(cases[caseId].timestamp != 0, "Case not found");
        require(_isValidCID(cid), "Invalid CID format");

        aiReports[caseId] = cid;
        emit AIReportStored(caseId, cid);
        emit LogEntry(caseId, msg.sender, "AI Report", "System generated", cid);
    }

    // --- ADMIN ROLE MANAGEMENT ---
    function grantReviewer(address account)
        external
        onlyRole(DEFAULT_ADMIN_ROLE)
    {
        grantRole(REVIEWER_ROLE, account);
    }

    function revokeReviewer(address account)
        external
        onlyRole(DEFAULT_ADMIN_ROLE)
    {
        revokeRole(REVIEWER_ROLE, account);
    }

    // --- VIEWS ---
    function getCaseWithAI(bytes32 caseId)
        external
        view
        returns (
            string memory ipfsHash,
            bytes32    caseType,
            address    filer,
            uint256    timestamp,
            CaseStatus status,
            string memory aiReport
        )
    {
        CaseRecord storage rec = cases[caseId];
        require(rec.timestamp != 0, "Case not found");
        return (
            rec.ipfsHash,
            rec.caseType,
            rec.filer,
            rec.timestamp,
            rec.status,
            aiReports[caseId]
        );
    }

    // --- INTERNALS ---
    function _expireCase(bytes32 caseId) internal {
        CaseRecord storage rec = cases[caseId];
        _updateStatusCounts(rec.filer, rec.status, CaseStatus.Expired);
        rec.status = CaseStatus.Expired;
        emit CaseExpired(caseId);
        emit LogEntry(caseId, address(this), "Expired", "", "");
    }

    function _updateStatusCounts(
        address     user,
        CaseStatus  oldStatus,
        CaseStatus  newStatus
    ) internal {
        userCaseCounts[user][oldStatus]--;
        userCaseCounts[user][newStatus]++;
    }

    function _isAuthorized(CaseRecord storage rec, address actor)
        internal
        view
        returns (bool)
    {
        return
            actor == rec.filer ||
            hasRole(REVIEWER_ROLE, actor) ||
            hasRole(DEFAULT_ADMIN_ROLE, actor);
    }

    function _isValidTransition(CaseStatus oldStatus, CaseStatus newStatus)
        internal
        pure
        returns (bool)
    {
        // e.g., allow any change except Expired back to anything else
        if (oldStatus == CaseStatus.Expired) return false;
        return true;
    }

    function _isValidCID(string memory cid) internal pure returns (bool) {
        bytes memory b = bytes(cid);
        return b.length >= 46; // basic IPFS CIDv0 / CIDv1 check
    }

    // --- INTERFACE SUPPORT ---
    function supportsInterface(bytes4 interfaceId)
        public
        view
        virtual
        override(AccessControlEnumerable, ERC165)
        returns (bool)
    {
        return super.supportsInterface(interfaceId);
    }
}
```
