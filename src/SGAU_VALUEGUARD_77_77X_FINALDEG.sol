// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

contract SGAU_VALUEGUARD_77_77X_FINALDEG {
    address public owner;

    string public constant ENS_ANCHOR = "donadams1969.eth";
    address public constant TREASURY_ANCHOR = 0xb103666AB91ceb4Cbb9e1FC21B81f1ec93601BeB;

    bool public transfersFrozen;

    event OwnershipTransferred(address indexed previousOwner, address indexed newOwner);
    event TransfersFrozen(bool frozen, uint256 timestamp);

    struct Attestation {
        bytes32 auditHash;
        string  auditUri;
        uint256 timestamp;
        address recorder;
        string  memo;
    }

    Attestation public latestAttestation;

    uint256 public attestationCount;
    mapping(uint256 => Attestation) public attestations;

    event AttestationRecorded(
        uint256 indexed index,
        bytes32 indexed auditHash,
        address indexed recorder,
        string auditUri,
        string memo,
        uint256 timestamp
    );

    mapping(address => bool) public allowlisted;
    event AllowlistUpdated(address indexed account, bool allowed);

    modifier onlyOwner() {
        require(msg.sender == owner, "NOT_OWNER");
        _;
    }

    constructor(address initialOwner, bool startFrozen) {
        require(initialOwner != address(0), "BAD_OWNER");
        owner = initialOwner;
        transfersFrozen = startFrozen;

        emit OwnershipTransferred(address(0), initialOwner);
        emit TransfersFrozen(startFrozen, block.timestamp);
    }

    function transferOwnership(address newOwner) external onlyOwner {
        require(newOwner != address(0), "BAD_OWNER");
        address prev = owner;
        owner = newOwner;
        emit OwnershipTransferred(prev, newOwner);
    }

    function setFrozen(bool frozen) external onlyOwner {
        transfersFrozen = frozen;
        emit TransfersFrozen(frozen, block.timestamp);
    }

    function setAllowlisted(address account, bool allowed) external onlyOwner {
        require(account != address(0), "BAD_ACCOUNT");
        allowlisted[account] = allowed;
        emit AllowlistUpdated(account, allowed);
    }

    function recordAttestation(bytes32 auditHash, string calldata auditUri, string calldata memo) external onlyOwner {
        require(auditHash != bytes32(0), "BAD_HASH");

        Attestation memory a = Attestation({
            auditHash: auditHash,
            auditUri: auditUri,
            timestamp: block.timestamp,
            recorder: msg.sender,
            memo: memo
        });

        attestations[attestationCount] = a;
        latestAttestation = a;

        emit AttestationRecorded(
            attestationCount,
            auditHash,
            msg.sender,
            auditUri,
            memo,
            block.timestamp
        );

        attestationCount += 1;
    }

    function isAllowed(address actor) public view returns (bool) {
        if (!transfersFrozen) return true;
        return allowlisted[actor];
    }

    function bindingFingerprint() external view returns (bytes32) {
        return keccak256(
            abi.encodePacked(
                ENS_ANCHOR,
                TREASURY_ANCHOR,
                latestAttestation.auditHash
            )
        );
    }
}
