// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/Pausable.sol";
import "@openzeppelin/contracts/utils/ReentrancyGuard.sol";
import "@openzeppelin/contracts/access/extensions/AccessControlEnumerable.sol";
import "@openzeppelin/contracts/utils/cryptography/ECDSA.sol";
import "@openzeppelin/contracts/utils/introspection/ERC165.sol";

/// @title VALOR Case Registry v3 (Improved)
/// @notice Enterprise-grade case management with AI integration and temporal controls
contract ValorCaseRegistryV3 is
    ERC165,
    Ownable,
    Pausable,
    ReentrancyGuard,
    AccessControlEnumerable
{
    using ECDSA for bytes32;

    enum CaseStatus {
        Filed,
        Reviewed,
        InProgress,
        Closed,
        Rejected,
        Appealed,
        Expired
    }

    bytes32 public constant REVIEWER_ROLE = keccak256("REVIEWER_ROLE");
    bytes32 public constant MODERATOR_ROLE = keccak256("MODERATOR_ROLE");
    bytes32 public constant CLOSER_ROLE = keccak256("CLOSER_ROLE");
    bytes32 public constant AI_HANDLER_ROLE = keccak256("AI_HANDLER_ROLE");

    struct Case {
        uint256 id;
        string cid;
        address submitter;
        CaseStatus status;
        uint256 createdAt;
        uint256 updatedAt;
    }

    uint256 private _caseCounter;
    mapping(uint256 => Case) public _cases;
    mapping(uint256 => uint256) public caseExpirations;
    mapping(uint256 => string) private _aiReports;

    event CaseFiled(uint256 indexed id, address indexed submitter, string cid);
    event CaseStatusUpdated(
        uint256 indexed id,
        CaseStatus oldStatus,
        CaseStatus newStatus,
        string note
    );
    event CaseExpired(uint256 indexed id);
    event AIReportStored(uint256 indexed id, string cid);

    modifier checkExpiration(uint256 id) {
        uint256 exp = caseExpirations[id];
        if (exp != 0 && block.timestamp > exp) {
            _expireCase(id);
        }
        _;
    }

    constructor(address initialOwner) Ownable(initialOwner) {
        _grantRole(DEFAULT_ADMIN_ROLE, initialOwner);
    }

    function fileCase(string calldata cid) external whenNotPaused returns (uint256) {
        require(_isValidCID(cid), "Invalid CID");
        _caseCounter++;
        uint256 newId = _caseCounter;
        _cases[newId] = Case({
            id: newId,
            cid: cid,
            submitter: msg.sender,
            status: CaseStatus.Filed,
            createdAt: block.timestamp,
            updatedAt: block.timestamp
        });
        emit CaseFiled(newId, msg.sender, cid);
        return newId;
    }

    function updateCaseStatus(
        uint256 id,
        CaseStatus newStatus,
        string calldata note,
        string calldata aiReportCID
    )
        external
        whenNotPaused
        nonReentrant
        checkExpiration(id)
    {
        Case storage c = _cases[id];
        require(c.createdAt != 0, "Case not found");

        bool authorized = false;
        if (newStatus == CaseStatus.Reviewed) {
            authorized = hasRole(REVIEWER_ROLE, msg.sender);
        } else if (newStatus == CaseStatus.InProgress) {
            authorized = hasRole(MODERATOR_ROLE, msg.sender);
        } else if (newStatus == CaseStatus.Closed || newStatus == CaseStatus.Rejected) {
            authorized = hasRole(CLOSER_ROLE, msg.sender);
        }
        require(authorized || hasRole(DEFAULT_ADMIN_ROLE, msg.sender), "Unauthorized");

        require(isValidStatusChange(c.status, newStatus), "Invalid status change");

        CaseStatus oldStatus = c.status;
        c.status = newStatus;
        c.updatedAt = block.timestamp;

        if (bytes(aiReportCID).length > 0) {
            require(_isValidCID(aiReportCID), "Invalid CID");
            _aiReports[id] = aiReportCID;
            emit AIReportStored(id, aiReportCID);
        }

        emit CaseStatusUpdated(id, oldStatus, newStatus, note);
    }

    function setCaseExpiration(uint256 id, uint256 duration)
        external
        onlyRole(MODERATOR_ROLE)
    {
        require(_cases[id].createdAt != 0, "Case not found");
        caseExpirations[id] = block.timestamp + duration;
    }

    function getCase(uint256 id)
        external
        view
        returns (Case memory, string memory)
    {
        require(_cases[id].createdAt != 0, "Case not found");
        return (_cases[id], _aiReports[id]);
    }

    function isValidStatusChange(CaseStatus oldStatus, CaseStatus newStatus) internal pure returns (bool) {
        if (oldStatus == CaseStatus.Expired) return false;
        if (newStatus == CaseStatus.Filed) return false;

        // State machine logic
        if (oldStatus == CaseStatus.Filed) {
            return newStatus == CaseStatus.Reviewed;
        }
        if (oldStatus == CaseStatus.Reviewed) {
            return newStatus == CaseStatus.InProgress || newStatus == CaseStatus.Rejected;
        }
        if (oldStatus == CaseStatus.InProgress) {
            return newStatus == CaseStatus.Closed || newStatus == CaseStatus.Rejected;
        }

        // Closed, Rejected, Appealed states are terminal for now
        if (oldStatus == CaseStatus.Closed || oldStatus == CaseStatus.Rejected || oldStatus == CaseStatus.Appealed) {
            return false;
        }

        return false;
    }

    function _expireCase(uint256 id) internal {
        Case storage c = _cases[id];
        if (c.status != CaseStatus.Expired) {
            c.status = CaseStatus.Expired;
            c.updatedAt = block.timestamp;
            emit CaseExpired(id);
        }
    }


    function _isValidCID(string memory cid) internal pure returns (bool) {
        return bytes(cid).length >= 46;
    }

    function supportsInterface(bytes4 interfaceId)
        public
        view
        override(AccessControlEnumerable, ERC165)
        returns (bool)
    {
        return super.supportsInterface(interfaceId);
    }
}

