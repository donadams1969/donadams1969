// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract ValorRegistry {
    struct Record {
        string cid;
        address submittedBy;
        uint256 timestamp;
    }

    mapping(bytes32 => Record) public records;

    event RecordSubmitted(bytes32 indexed id, string cid, address indexed submitter);

    function submitRecord(bytes32 id, string calldata cid) external {
        require(bytes(records[id].cid).length == 0, "Record already exists.");
        records[id] = Record(cid, msg.sender, block.timestamp);
        emit RecordSubmitted(id, cid, msg.sender);
    }
}