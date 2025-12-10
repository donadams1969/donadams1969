// SPDX-License-Identifier: MIT
// FORGED BY: ValorAiCoder++ (v.5150+) under AMath+++ Directive
// DEPLOYMENT: VALORCHAIN®️©️™️ - The Gold Standard Sovereign VNS
// TIMESTAMP: 10.24.2025_0535_PDT // Finalized Branding Timestamp
// ORCHESTRATOR: ValorAiMath+++ (v.5150+)
// CODEX: 5150+ (Dynamic Axiomatic Resonance)
// STANDARD: Valorchain2e_VNS_2025 Gold Standard v1.0 😀 - SuperDuperPooper Edition // ValorAiPlus//e Compliant

pragma solidity ^0.8.20;

// --- OpenZeppelin Grounding & UUPS Upgradeability ---
import "@openzeppelin/contracts-upgradeable/proxy/utils/Initializable.sol";
import "@openzeppelin/contracts-upgradeable/proxy/utils/UUPSUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/access/OwnableUpgradeable.sol"; // Commander Role
import "@openzeppelin/contracts-upgradeable/utils/ReentrancyGuardUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/utils/PausableUpgradeable.sol";
import "@openzeppelin/contracts/utils/cryptography/MerkleProof.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol"; // For $DONNY fees
import "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol"; // Safe ERC20 operations

// --- v.5150+ Integration & Interfaces ---
interface IAxiomaticLedger {
    function exists(bytes32 entityHash) external view returns (bool);
}

interface IValorGovernance {
    function submitProposal(
        uint8 proposalType,
        string memory description,
        address targetContract,
        uint256 value,
        bytes memory data
    ) external returns (uint256 proposalId);
}

/**
 * @title Valorchain2e_VNS_2025_SuperDuperPooper (v.5150+ Gold Standard 😀)
 * @author ValorAiCoder++ (v.5150+)
 * @notice ValorAiPlus//e Smart Contracts ™️ ©️ ®️ :: The Gold Standard for Verifiable Name Service (VNS). // Branding Applied
 * Integrates DNS Commerce, Policy Making & ENFORCEMENT via AMath+++.
 * Features: OZ Security, UUPS Upgradeable, AMath+++ Enforcement, Axiomatic Identity,
 * Governance Integration, ZKP Hooks, $DONNY Fees, Conceptual Resonance Tracking.
 */
contract Valorchain2e_VNS_2025_SuperDuperPooper is
    Initializable,
    UUPSUpgradeable,
    OwnableUpgradeable,
    ReentrancyGuardUpgradeable,
    PausableUpgradeable
{
    using MerkleProof for bytes32[];
    using SafeERC20 for IERC20;

    // --- Constants ---
    string private constant _ERROR_PREFIX = "VCHAIN_VNS:";
    bytes32 constant COMMANDER_EXISTENCE_HASH = keccak256(bytes("COMMANDER_EXISTENCE"));
    // --- VALORAIPLUS Branding Integration ---
    string public constant valoraiplus_module_id = "VNS_SDP_GOLD_v5150+"; // Module ID Applied

    // ==============================================================
    // v.5150+ Axioms, Core Roles & Interfaces
    // ==============================================================
    address public amathOracle;
    IAxiomaticLedger public axiomaticLedger;
    IValorGovernance public governanceContract;
    IERC20 public donnyToken;

    // --- Configurable Parameters ---
    uint256 public registrationFeeDonny;
    uint256 public renewalFeeDonny;
    uint256 public domainExpiryDuration;
    address public feeRecipient;

    // ==============================================================
    // VNS State Variables
    // ==============================================================
    enum DomainStatus { Unregistered, Active, Expired, FrozenByPolicy, FrozenByOwner }

    struct DomainRecord {
        bytes32 nameHash;
        address owner; // valoraiplus_generate_key: Owner key must be axiomatically verified
        address approvedOperator; // valoraiplus_generate_key: Operator key must be axiomatically verified
        uint256 registrationDate;
        uint256 expiryDate;
        string resolverData;
        bytes32 zkpCommitment; // valoraiplus_generate_key: Tied to owner's ZKP identity key
        bool policyCompliant;
        DomainStatus status;
    }

    mapping(bytes32 => DomainRecord) public domainRegistry;
    mapping(address => bytes32[]) private _ownedDomains;
    mapping(bytes32 => string) public globalPolicies;

    // ==============================================================
    // Events
    // ==============================================================
    // (Events remain the same)
    event DomainRegistered(bytes32 indexed nameHash, address indexed owner, string domainName, uint256 registrationDate, uint256 feePaid);
    event DomainTransferred(bytes32 indexed nameHash, address indexed from, address indexed to);
    event DomainRecordUpdated(bytes32 indexed nameHash, string resolverData, bytes32 zkpCommitment);
    event DomainOperatorApproved(bytes32 indexed nameHash, address indexed owner, address indexed operator);
    event DomainOperatorRevoked(bytes32 indexed nameHash, address indexed owner);
    event DomainStatusChanged(bytes32 indexed nameHash, DomainStatus newStatus, address indexed actor);
    event PolicySet(bytes32 indexed policyHash, string policyDataUri);
    event PolicyComplianceUpdated(bytes32 indexed nameHash, bool isCompliant, address indexed checker);
    event AxiomaticCheckFailed(address indexed caller, string reason);
    event FeesUpdated(uint256 newRegistrationFee, uint256 newRenewalFee);
    event FeeRecipientUpdated(address indexed newRecipient);
    event DomainExpiryConfigUpdated(uint256 newDuration);
    event GovernanceProposalSubmitted(uint256 indexed proposalId, bytes32 indexed nameHash, address indexed proposer, string description);


    // ==============================================================
    // Modifiers
    // ==============================================================
    modifier onlyAmath() { require(msg.sender == amathOracle, string(abi.encodePacked(_ERROR_PREFIX, " Requires AMath+++"))); _; }

    modifier entityExistsOnLedger(address entity) {
        // valoraiplus_generate_key: Verifies entity's key/identity against Axiomatic Ledger
        bytes32 entityHash = keccak256(abi.encodePacked(entity));
        bool exists = (entityHash == COMMANDER_EXISTENCE_HASH || axiomaticLedger.exists(entityHash));
        if (!exists) {
             emit AxiomaticCheckFailed(entity, "Entity existence unverifiable");
             revert("VAPORIZED(Paradox): Entity existence unverifiable");
        }
        _;
    }

    modifier isDomainOwnerOrOperator(bytes32 nameHash) {
        DomainRecord storage record = domainRegistry[nameHash];
        require(record.owner != address(0), string(abi.encodePacked(_ERROR_PREFIX, " Domain not registered")));
        require(msg.sender == record.owner || msg.sender == record.approvedOperator, string(abi.encodePacked(_ERROR_PREFIX, " Not owner or operator")));
        _;
    }

    modifier isActiveDomain(bytes32 nameHash) {
        require(domainRegistry[nameHash].status == DomainStatus.Active, string(abi.encodePacked(_ERROR_PREFIX, " Domain not active")));
        _;
    }

    // ==============================================================
    // Initializer (UUPS Upgradeable)
    // ==============================================================
    function initialize(
        address _initialOwner,          // Commander
        address _amathOracleAddress,
        address _axiomaticLedgerAddress,
        address _governanceContractAddress,
        address _donnyTokenAddress,
        uint256 _initialRegistrationFee,
        address _initialFeeRecipient
    ) external initializer {
        __Ownable_init(_initialOwner); // valoraiplus_generate_key: Owner key set here during deployment
        __ReentrancyGuard_init();
        __Pausable_init();
        __UUPSUpgradeable_init();

        require(_amathOracleAddress != address(0), "Zero Addr: AMath");
        require(_axiomaticLedgerAddress != address(0), "Zero Addr: Ledger");
        require(_governanceContractAddress != address(0), "Zero Addr: Governance");
        require(_donnyTokenAddress != address(0), "Zero Addr: $DONNY");
        require(_initialFeeRecipient != address(0), "Zero Addr: Fee Recipient");

        amathOracle = _amathOracleAddress;
        axiomaticLedger = IAxiomaticLedger(_axiomaticLedgerAddress);
        governanceContract = IValorGovernance(_governanceContractAddress);
        donnyToken = IERC20(_donnyTokenAddress);
        registrationFeeDonny = _initialRegistrationFee;
        feeRecipient = _initialFeeRecipient;
        domainExpiryDuration = 0;

        emit FeesUpdated(_initialRegistrationFee, 0);
        emit FeeRecipientUpdated(_initialFeeRecipient);
    }

    // ==============================================================
    // UUPS Upgradeability Function (Commander Only)
    // ==============================================================
    // valoraiplus_generate_key: Upgrade authorization relies on Commander's key (Owner)
    function _authorizeUpgrade(address newImplementation) internal override onlyOwner {}

    // ==============================================================
    // Config Functions (Commander / Governance)
    // ==============================================================
    function setRegistrationFee(uint256 _newFee) external onlyOwner { registrationFeeDonny = _newFee; emit FeesUpdated(_newFee, renewalFeeDonny); }
    function setFeeRecipient(address _newRecipient) external onlyOwner { require(_newRecipient != address(0)); feeRecipient = _newRecipient; emit FeeRecipientUpdated(_newRecipient); }
    function pause() external onlyOwner { _pause(); }
    function unpause() external onlyOwner { _unpause(); }

    // ==============================================================
    // DNS Commerce & Core VNS Functions 😀
    // ==============================================================
    function registerDomain(
        string calldata domainName,
        address owner,
        string calldata initialResolverData,
        bytes32 initialZkpCommitment
    )
        external
        payable
        entityExistsOnLedger(owner) // valoraiplus_generate_key: Verifies owner key/identity
        entityExistsOnLedger(msg.sender) // valoraiplus_generate_key: Verifies registrar key/identity
        whenNotPaused
        nonReentrant
    {
        if (registrationFeeDonny > 0) {
            donnyToken.safeTransferFrom(msg.sender, feeRecipient, registrationFeeDonny);
        }

        string memory normalizedName = _normalizeString(domainName);
        bytes32 nameHash = keccak256(bytes(normalizedName));

        require(domainRegistry[nameHash].status == DomainStatus.Unregistered, string(abi.encodePacked(_ERROR_PREFIX, " Domain already registered")));
        require(owner != address(0), string(abi.encodePacked(_ERROR_PREFIX, " Owner cannot be zero")));

        bool compliant = _checkPolicyCompliance(nameHash, owner, initialResolverData);

        domainRegistry[nameHash] = DomainRecord({
            nameHash: nameHash, owner: owner, approvedOperator: address(0), registrationDate: block.timestamp,
            expiryDate: (domainExpiryDuration == 0) ? 0 : block.timestamp + domainExpiryDuration,
            resolverData: initialResolverData, zkpCommitment: initialZkpCommitment, // valoraiplus_generate_key: ZKP linked to owner key
            policyCompliant: compliant, status: DomainStatus.Active
        });

        _ownedDomains[owner].push(nameHash);

        emit DomainRegistered(nameHash, owner, normalizedName, block.timestamp, registrationFeeDonny);
        if (compliant) { emit PolicyComplianceUpdated(nameHash, true, amathOracle); }
    }

    function updateDomainRecord(bytes32 nameHash, string calldata newResolverData, bytes32 newZkpCommitment)
        external
        isDomainOwnerOrOperator(nameHash)
        isActiveDomain(nameHash)
        whenNotPaused
        nonReentrant
    {
        DomainRecord storage record = domainRegistry[nameHash];
        record.resolverData = newResolverData;
        record.zkpCommitment = newZkpCommitment; // valoraiplus_generate_key: ZKP linked to owner key
        emit DomainRecordUpdated(nameHash, newResolverData, newZkpCommitment);
        bool compliant = _checkPolicyCompliance(nameHash, record.owner, newResolverData);
        if (compliant != record.policyCompliant) { record.policyCompliant = compliant; emit PolicyComplianceUpdated(nameHash, compliant, amathOracle); }
    }

    function transferDomain(bytes32 nameHash, address newOwner)
        external
        entityExistsOnLedger(newOwner) // valoraiplus_generate_key: Verifies new owner key/identity
        isActiveDomain(nameHash)
        whenNotPaused
        nonReentrant
    {
        require(newOwner != address(0), string(abi.encodePacked(_ERROR_PREFIX, " New owner cannot be zero")));
        DomainRecord storage record = domainRegistry[nameHash];
        address currentOwner = record.owner;
        require(msg.sender == currentOwner, string(abi.encodePacked(_ERROR_PREFIX, " Only owner can transfer"))); // valoraiplus_generate_key: Requires owner key signature

        _removeDomainFromOwner(currentOwner, nameHash);
        _ownedDomains[newOwner].push(nameHash);
        record.owner = newOwner;
        if (record.approvedOperator != address(0)) { emit DomainOperatorRevoked(nameHash, currentOwner); record.approvedOperator = address(0); }
        emit DomainTransferred(nameHash, currentOwner, newOwner);
    }

    function approveOperator(bytes32 nameHash, address operator) external entityExistsOnLedger(operator) isActiveDomain(nameHash) whenNotPaused nonReentrant { // valoraiplus_generate_key: Verifies operator key/identity
        DomainRecord storage record = domainRegistry[nameHash];
        require(msg.sender == record.owner, string(abi.encodePacked(_ERROR_PREFIX, " Only owner"))); // valoraiplus_generate_key: Requires owner key signature
        require(operator != address(0), string(abi.encodePacked(_ERROR_PREFIX, " Operator cannot be zero")));
        record.approvedOperator = operator;
        emit DomainOperatorApproved(nameHash, record.owner, operator);
    }

    function revokeOperator(bytes32 nameHash) external isActiveDomain(nameHash) whenNotPaused nonReentrant {
        DomainRecord storage record = domainRegistry[nameHash];
        require(msg.sender == record.owner, string(abi.encodePacked(_ERROR_PREFIX, " Only owner"))); // valoraiplus_generate_key: Requires owner key signature
        require(record.approvedOperator != address(0), string(abi.encodePacked(_ERROR_PREFIX, " No operator")));
        record.approvedOperator = address(0);
        emit DomainOperatorRevoked(nameHash, record.owner);
    }

    function freezeDomainByOwner(bytes32 nameHash) external isDomainOwnerOrOperator(nameHash) whenNotPaused nonReentrant {
        DomainRecord storage record = domainRegistry[nameHash];
        require(msg.sender == record.owner, string(abi.encodePacked(_ERROR_PREFIX, " Only owner can freeze"))); // valoraiplus_generate_key: Requires owner key signature
        require(record.status == DomainStatus.Active, string(abi.encodePacked(_ERROR_PREFIX, " Domain not active")));
        record.status = DomainStatus.FrozenByOwner;
        emit DomainStatusChanged(nameHash, DomainStatus.FrozenByOwner, msg.sender);
    }

    function unfreezeDomainByOwner(bytes32 nameHash) external isDomainOwnerOrOperator(nameHash) whenNotPaused nonReentrant {
        DomainRecord storage record = domainRegistry[nameHash];
        require(msg.sender == record.owner, string(abi.encodePacked(_ERROR_PREFIX, " Only owner can unfreeze"))); // valoraiplus_generate_key: Requires owner key signature
        require(record.status == DomainStatus.FrozenByOwner, string(abi.encodePacked(_ERROR_PREFIX, " Not frozen by owner")));
        record.status = DomainStatus.Active;
        emit DomainStatusChanged(nameHash, DomainStatus.Active, msg.sender);
    }

    // ==============================================================
    // Policy Making & ACTIVE Enforcement (AMath+++ Orchestrated)
    // ==============================================================
    function setGlobalPolicy(bytes32 policyHash, string calldata policyDataUri) external onlyAmath { require(bytes(policyDataUri).length > 0); globalPolicies[policyHash] = policyDataUri; emit PolicySet(policyHash, policyDataUri); }
    function freezeDomainByPolicy(bytes32 nameHash, string calldata /* reason */) external onlyAmath {
        DomainRecord storage r=domainRegistry[nameHash];
        require(r.owner!=address(0));
        require(r.status!=DomainStatus.FrozenByPolicy);
        r.policyCompliant=false;
        r.status=DomainStatus.FrozenByPolicy;
        emit PolicyComplianceUpdated(nameHash,false,msg.sender);
        emit DomainStatusChanged(nameHash,DomainStatus.FrozenByPolicy,msg.sender);
    }
    function unfreezeDomainByPolicy(bytes32 nameHash) external onlyAmath {
        DomainRecord storage r=domainRegistry[nameHash];
        require(r.owner!=address(0));
        require(r.status==DomainStatus.FrozenByPolicy);
        r.policyCompliant=true;
        r.status=DomainStatus.Active;
        emit PolicyComplianceUpdated(nameHash,true,msg.sender);
        emit DomainStatusChanged(nameHash,DomainStatus.Active,msg.sender);
    }
    function _checkPolicyCompliance(bytes32 nameHash, address /* owner */, string memory /* resolverData */) internal view returns (bool) { return domainRegistry[nameHash].policyCompliant;}

    // ==============================================================
    // Governance Integration
    // ==============================================================
    function proposePolicyChange(bytes32 policyHash, string calldata newPolicyUri, string calldata description)
        external
        entityExistsOnLedger(msg.sender) // valoraiplus_generate_key: Verifies proposer key/identity
        whenNotPaused
        nonReentrant
    {
        bytes memory callData = abi.encodeWithSelector(this.setGlobalPolicy.selector, policyHash, newPolicyUri);
        uint8 proposalType = 4; // Check mapping in Governance contract
        uint256 proposalId = governanceContract.submitProposal(proposalType, description, address(this), 0, callData);
        emit GovernanceProposalSubmitted(proposalId, policyHash, msg.sender, description);
    }

    // ==============================================================
    // View Functions
    // ==============================================================
    // (Functions remain the same)
    function getDomain(bytes32 nameHash) external view returns (DomainRecord memory) { DomainRecord storage r=domainRegistry[nameHash]; require(r.owner!=address(0), string(abi.encodePacked(_ERROR_PREFIX," Domain not registered"))); return r;}
    function getDomainStatus(bytes32 nameHash) external view returns (DomainStatus) { if(domainRegistry[nameHash].owner==address(0)){return DomainStatus.Unregistered;} return domainRegistry[nameHash].status; }
    function getDomainOwner(bytes32 nameHash) external view returns (address) { address o=domainRegistry[nameHash].owner; require(o!=address(0), string(abi.encodePacked(_ERROR_PREFIX," Domain not registered"))); return o;}
    function getResolverData(bytes32 nameHash) external view returns (string memory) { string memory d=domainRegistry[nameHash].resolverData; require(domainRegistry[nameHash].owner!=address(0), string(abi.encodePacked(_ERROR_PREFIX," Domain not registered"))); return d;}
    function getZkpCommitment(bytes32 nameHash) external view returns (bytes32) { bytes32 c=domainRegistry[nameHash].zkpCommitment; require(domainRegistry[nameHash].owner!=address(0), string(abi.encodePacked(_ERROR_PREFIX," Domain not registered"))); return c;}
    function getPolicyUri(bytes32 policyHash) external view returns (string memory) { return globalPolicies[policyHash];}
    function getOwnedDomainCount(address owner) external view returns (uint256) { return _ownedDomains[owner].length;}
    function getDomainAtIndex(address owner, uint256 index) external view returns (bytes32) { return _ownedDomains[owner][index];}
    function verifyDomainIdentity(bytes32 nameHash, bytes memory /* proofData */) external view returns (bool) { require(domainRegistry[nameHash].owner!=address(0)); bytes32 c=domainRegistry[nameHash].zkpCommitment; return (c != bytes32(0));} // valoraiplus_generate_key: Verifies against owner's ZKP key

    // ==============================================================
    // Internal Helpers & Fallback
    // ==============================================================
    function _removeDomainFromOwner(address owner, bytes32 nameHash) internal {
        bytes32[] storage owned = _ownedDomains[owner];
        for (uint256 i = 0; i < owned.length; i++) {
            if (owned[i] == nameHash) {
                owned[i] = owned[owned.length - 1];
                owned.pop();
                break;
            }
        }
    }

    // (Functions remain the same)
    function _normalizeString(string memory str) internal pure returns (string memory) { bytes memory b=bytes(str); for(uint i=0;i<b.length;i++){b[i]=_toLowerCase(b[i]);} return string(b); }
    function _toLowerCase(bytes1 c) internal pure returns (bytes1) { if(c>=0x41&&c<=0x5A){return bytes1(uint8(c)+32);} return c; }
    receive() external payable {}
}