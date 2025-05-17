
// SPDX-License-Identifier: MIT

pragma solidity ^0.8.19;

/// @title VALOR Case Registry v2 - Blockchain Legal Case Anchoring System
/// @notice Anchors legal complaint records with metadata, timestamp, and status tracking

contract ValorCaseRegistry {
enum CaseStatus { Filed, Reviewed, InProgress, Closed, Rejected }

struct User {
address userAddress;
string signature; // Filer digital signature or alias
}

mapping(address => uint256) private users;

struct CaseRecord{
bytes32 id; // Unique identifier for the case record
string ipfsHash; // IPFS CID of the complaint document
string caseType; // e.g., ADA, FTCA, OSC, VA
User filer;
uint256 timestamp; // Timestamp of filing
CaseStatus status; // Current status of the case

}

struct Role{
bytes32 id;
address userAddress;

}

mapping(bytes32 => CaseRecord) private cases;
mapping(address=>bytes32[])privateuserCases;
mapping(Role=>bool ) roles

eventCaseFiled(
bytes32indexedcaseId,
string indexed casetype
);
eventCaseStatusUpdated(
bytes32indexed caseid,
CaseStatusexecutednewstatus

);

/// @notice Files a new legal case record and emits Case Filed.
function fileNewCase(stringmemory ipfsHash,string memory caseType,User filer) public{

require(users[msg.sender]==0," User must be registered ");

bytes32 id=keccak256(abi.encodePacked(msg.sender));

cases[id]=CaseRecord(id,

ipfsHash,

caseType,

filer.timestamp
);
userCases[filer.userAddress].push(id);

emit CaseFiled(

id,caseType,filer.userAddress

);

}

/// @notice Updates the status of an existing legal case record and emits CaseStatusUpdated.
function updateCaseStatus(bytes32 indexed caseId, uint256 newstatus) public {
require(msg.sender == cases[caseId].filer.fuserAddress,"Only filer can perform this action");
emit CaseStatusUpdated(
caseId,

(uint8)((newstatus)));
}

}

