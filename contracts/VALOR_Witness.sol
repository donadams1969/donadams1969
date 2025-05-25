// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract VALOR_Witness {
    address public controller;

    struct ModelSnapshot {
        string modelName;
        string ipfsCID;
        string ethAnchor;
        uint256 timestamp;
        address submittedBy;
    }

    mapping(bytes32 => ModelSnapshot) public snapshots;
    mapping(address => bool) public trustedAgents;

    event SnapshotAnchored(
        bytes32 indexed id,
        string modelName,
        string ipfsCID,
        string ethAnchor,
        uint256 timestamp,
        address indexed submittedBy
    );

    modifier onlyController() {
        require(msg.sender == controller, "Not authorized");
        _;
    }

    modifier onlyTrustedAgent() {
        require(trustedAgents[msg.sender], "Not a trusted agent");
        _;
    }

    constructor() {
        controller = msg.sender;
        trustedAgents[msg.sender] = true;
    }

    function authorizeAgent(address agent, bool status) external onlyController {
        trustedAgents[agent] = status;
    }

    function anchorSnapshot(
        bytes32 id,
        string calldata modelName,
        string calldata ipfsCID,
        string calldata ethAnchor
    ) external onlyTrustedAgent {
        require(bytes(snapshots[id].modelName).length == 0, "Snapshot already exists");

        snapshots[id] = ModelSnapshot({
            modelName: modelName,
            ipfsCID: ipfsCID,
            ethAnchor: ethAnchor,
            timestamp: block.timestamp,
            submittedBy: msg.sender
        });

        emit SnapshotAnchored(id, modelName, ipfsCID, ethAnchor, block.timestamp, msg.sender);
    }

    function getSnapshot(bytes32 id) public view returns (string memory, string memory, string memory, uint256, address) {
        ModelSnapshot memory snap = snapshots[id];
        return (snap.modelName, snap.ipfsCID, snap.ethAnchor, snap.timestamp, snap.submittedBy);
    }
}