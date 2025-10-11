// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/access/Ownable.sol";

/**
 * @title VALORAIPLUSGrokProvenance
 * @author VALORAIPLUS
 * @notice Stores immutable records for the ValorPsych++ system, including
 * file hashes, AI fingerprints, and sovereign identifiers (MNID, CAID, GYID).
 */
contract VALORAIPLUSGrokProvenance is Ownable {

    struct ProvenanceRecord {
        bytes32 fileHash;
        bytes32 aiFingerprint;
        string mnid;
        string caid;
        string gyid;
        address author;
        uint256 timestamp;
    }

    mapping(bytes32 => ProvenanceRecord) public records;

    event FileRegistered(
        bytes32 indexed fileHash,
        address indexed author,
        string mnid,
        string caid,
        string gyid
    );

    constructor() Ownable(msg.sender) {}

    /**
     * @notice Registers a new file's provenance data.
     * @param _fileHash The hash of the file/profile data.
     * @param _aiFingerprint The combined hash representing the AI's analysis.
     * @param _mnid The Master Node Identifier.
     * @param _caid The Creator Authority Identifier.
     * @param _gyid The Gaia-Yield Identifier.
     */
    function registerFile(
        bytes32 _fileHash,
        bytes32 _aiFingerprint,
        string memory _mnid,
        string memory _caid,
        string memory _gyid
    ) external {
        require(records[_fileHash].timestamp == 0, "File already registered");

        records[_fileHash] = ProvenanceRecord({
            fileHash: _fileHash,
            aiFingerprint: _aiFingerprint,
            mnid: _mnid,
            caid: _caid,
            gyid: _gyid,
            author: msg.sender,
            timestamp: block.timestamp
        });

        emit FileRegistered(_fileHash, msg.sender, _mnid, _caid, _gyid);
    }

    /**
     * @notice Verifies and retrieves the provenance record for a given file hash.
     * @param _fileHash The hash of the file to verify.
     * @return The complete ProvenanceRecord struct.
     */
    function verifyFile(bytes32 _fileHash) external view returns (ProvenanceRecord memory) {
        require(records[_fileHash].timestamp != 0, "File not registered");
        return records[_fileHash];
    }
}