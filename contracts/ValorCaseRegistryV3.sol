// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import "@openzeppelin/contracts/access/AccessControl.sol";
import "@openzeppelin/contracts/utils/cryptography/ECDSA.sol";
import "@openzeppelin/contracts/utils/introspection/ERC165.sol";

/// @title VALOR Case Registry v3 (Improved)
/// @notice Enterprise-grade case management with AI integration and temporal controls
contract ValorCaseRegistryV3 is
    AccessControl,
    ERC165
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
    mapping(uint256 => Case) private _cases;
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

    constructor() {
        _grantRole(DEFAULT_ADMIN_ROLE, msg.sender);
    }

    function fileCase(string calldata cid) external /*whenNotPaused*/ returns (uint256) {
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

    /**
     * @notice Updates the status of an existing case.
     * @dev Requires the caller to be authorized. The status transition must be valid.
     * @param id The ID of the case to update.
     * @param newStatus The new status for the case.
     * @param note A note explaining the status change.
     * @param aiReportCID Optional IPFS CID of an AI report related to this update.
     */
    function updateCaseStatus(
        uint256 id,
        CaseStatus newStatus,
        string calldata note,
        string calldata aiReportCID
    )
        external
        /*whenNotPaused*/
        /*nonReentrant*/
        checkExpiration(id)
    {
        Case storage c = _cases[id];
        require(c.createdAt != 0, "Case not found");
        require(_isAuthorized(msg.sender, c.submitter), "Unauthorized");
        require(_isValidStatusTransition(c.status, newStatus), "Invalid status transition");

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

    /**
     * @notice Reopens a closed case, setting its status back to InProgress.
     * @dev Can only be called by an address with the MODERATOR_ROLE.
     * @param id The ID of the case to reopen.
     * @param note A note explaining why the case is being reopened.
     */
    function reopenCase(uint256 id, string calldata note)
        external
        /*whenNotPaused*/
        /*nonReentrant*/
        onlyRole(MODERATOR_ROLE)
    {
        Case storage c = _cases[id];
        require(c.createdAt != 0, "Case not found");
        require(c.status == CaseStatus.Closed, "Case is not closed");

        CaseStatus oldStatus = c.status;
        c.status = CaseStatus.InProgress;
        c.updatedAt = block.timestamp;

        emit CaseStatusUpdated(id, oldStatus, CaseStatus.InProgress, note);
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
        returns (
            uint256 caseId,
            string memory cid,
            address submitter,
            CaseStatus status,
            uint256 createdAt,
            uint256 updatedAt,
            string memory aiReport
        )
    {
        Case storage c = _cases[id];
        require(c.createdAt != 0, "Case not found");
        return (
            c.id,
            c.cid,
            c.submitter,
            c.status,
            c.createdAt,
            c.updatedAt,
            _aiReports[id]
        );
    }

    /**
     * @notice Checks if a status transition is valid based on the defined state machine.
     * @dev Internal pure function to enforce the case lifecycle.
     * @param oldStatus The current status of the case.
     * @param newStatus The target status for the case.
     * @return bool True if the transition is valid, false otherwise.
     */
    function _isValidStatusTransition(CaseStatus oldStatus, CaseStatus newStatus) internal pure returns (bool) {
        if (oldStatus == newStatus) return false; // No transition to the same status

        if (oldStatus == CaseStatus.Filed) {
            return newStatus == CaseStatus.Reviewed || newStatus == CaseStatus.InProgress || newStatus == CaseStatus.Rejected;
        }
        if (oldStatus == CaseStatus.Reviewed) {
            return newStatus == CaseStatus.InProgress || newStatus == CaseStatus.Rejected;
        }
        if (oldStatus == CaseStatus.InProgress) {
            return newStatus == CaseStatus.Closed || newStatus == CaseStatus.Rejected;
        }
        if (oldStatus == CaseStatus.Rejected) {
            return newStatus == CaseStatus.Appealed;
        }
        if (oldStatus == CaseStatus.Appealed) {
            return newStatus == CaseStatus.InProgress || newStatus == CaseStatus.Closed;
        }
        // Terminal states cannot be transitioned from
        if (oldStatus == CaseStatus.Closed || oldStatus == CaseStatus.Expired) {
            return false;
        }

        return false; // Default to invalid
    }

    function _expireCase(uint256 id) internal {
        Case storage c = _cases[id];
        if (c.status != CaseStatus.Expired) {
            c.status = CaseStatus.Expired;
            c.updatedAt = block.timestamp;
            emit CaseExpired(id);
        }
    }

    function _isAuthorized(address actor, address submitter) internal view returns (bool) {
        return
            actor == submitter ||
            hasRole(REVIEWER_ROLE, actor) ||
            hasRole(MODERATOR_ROLE, actor) ||
            hasRole(DEFAULT_ADMIN_ROLE, actor);
    }

    function _isValidCID(string memory cid) internal pure returns (bool) {
        return bytes(cid).length >= 46;
    }

    function supportsInterface(bytes4 interfaceId)
        public
        view
        override(AccessControl, ERC165)
        returns (bool)
    {
        return super.supportsInterface(interfaceId);
    }
}

