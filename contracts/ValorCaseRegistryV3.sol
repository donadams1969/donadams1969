// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/security/Pausable.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";
import "@openzeppelin/contracts/access/AccessControlEnumerable.sol";
import "@openzeppelin/contracts/utils/cryptography/ECDSA.sol";
import "@openzeppelin/contracts/utils/introspection/ERC165.sol";
import "./VALORCHAINGPrimeValidator.sol";

/// @title VALOR Case Registry v3 (Improved)
/// @notice Enterprise-grade case management with AI integration and temporal controls
contract ValorCaseRegistryV3 is
    Ownable,
    Pausable,
    ReentrancyGuard,
    AccessControlEnumerable,
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

    VALORCHAINGPrimeValidator public primeValidator;

    event CaseFiled(uint256 indexed id, address indexed submitter, string cid);
    event CaseStatusUpdated(
        uint256 indexed id,
        CaseStatus oldStatus,
        CaseStatus newStatus,
        string note
    );
    event CaseExpired(uint256 indexed id);
    event AIReportStored(uint256 indexed id, string cid);
    event PrimeValidatorUpdated(address indexed validatorAddress);
    event SystemAuditResult(bool genesisPrimeValid, bool coinbasePrimeValid);

    uint256 public genesis_prime;
    uint256 public coinbase_prime;

    mapping(address => bool) public flaggedAccounts;

    event AccountFlagged(address indexed account, bool isFlagged);

    modifier checkExpiration(uint256 id) {
        uint256 exp = caseExpirations[id];
        if (exp != 0 && block.timestamp > exp) {
            _expireCase(id);
        }
        _;
    }

    constructor() {
        _grantRole(DEFAULT_ADMIN_ROLE, msg.sender);
        genesis_prime = 2;
        coinbase_prime = 3;
    }

    /// @notice Audits core system variables for primality.
    /// @return A boolean array indicating the validity of each checked variable.
    function audit_system_variables() public view returns (bool[2] memory) {
        require(address(primeValidator) != address(0), "Prime validator not set");
        bool genesisValid = primeValidator.isPrime(genesis_prime);
        bool coinbaseValid = primeValidator.isPrime(coinbase_prime);
        // In a real scenario, we might revert or take other action.
        // For this simulation, we'll return the results and emit an event.
        // emit SystemAuditResult(genesisValid, coinbaseValid);
        return [genesisValid, coinbaseValid];
    }

    /// @notice Sets the address of the prime validator contract.
    /// @param validatorAddress The address of the VALORCHAINGPrimeValidator contract.
    function setPrimeValidator(address validatorAddress) external onlyOwner {
        primeValidator = VALORCHAINGPrimeValidator(validatorAddress);
        emit PrimeValidatorUpdated(validatorAddress);
    }

    /// @notice Validates that a case ID is a prime number, reverting if it's composite.
    /// @param id The ID of the case to validate.
    function validateCaseIdIsPrime(uint256 id) public view {
        require(address(primeValidator) != address(0), "Prime validator not set");
        require(_cases[id].createdAt != 0, "Case not found");
        require(!primeValidator.isComposite(id), "Case ID cannot be a composite number");
    }

    /// @notice Flags or unflags an account, restricting its ability to file cases.
    /// @param account The address of the account to flag.
    /// @param isFlagged The flag status.
    function flagAccount(address account, bool isFlagged) external onlyOwner {
        flaggedAccounts[account] = isFlagged;
        emit AccountFlagged(account, isFlagged);
    }

    function fileCase(string calldata cid) external whenNotPaused returns (uint256) {
        require(!flaggedAccounts[msg.sender], "Account is flagged");
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
        require(_isAuthorized(msg.sender, c.submitter), "Unauthorized");
        require(isValidStatusChange(c.status), "Invalid status change");

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

    function isValidStatusChange(CaseStatus oldStatus) internal pure returns (bool) {
        if (oldStatus == CaseStatus.Expired) return false;
        return true;
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
        override(AccessControlEnumerable, ERC165)
        returns (bool)
    {
        return super.supportsInterface(interfaceId);
    }
}

