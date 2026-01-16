// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import "forge-std/Script.sol";
import "../src/SGAU_VALUEGUARD_77_77X_FINALDEG.sol";
import "../src/Trunc.sol";

contract AttestScript is Script {
    function run() external {
        uint256 pk = vm.envUint("PRIVATE_KEY");

        address contractAddr = vm.envAddress("SGAU_CONTRACT_ADDRESS");
        bytes32 auditHash = vm.envBytes32("SGAU_AUDIT_HASH");
        string memory auditUri = vm.envString("SGAU_AUDIT_URI");
        string memory memo = vm.envString("SGAU_MEMO");

        SGAU_VALUEGUARD_77_77X_FINALDEG c = SGAU_VALUEGUARD_77_77X_FINALDEG(contractAddr);

        vm.startBroadcast(pk);
        c.recordAttestation(auditHash, auditUri, memo);
        vm.stopBroadcast();

        console2.log("ATTESTED_CONTRACT:", Trunc.addrShort(contractAddr));
        console2.log("AUDIT_HASH:", Trunc.hashShort(auditHash));
        console2.log("URI:", auditUri);
        console2.log("MEMO:", memo);
        console2.log("ATTESTATION_COUNT:", c.attestationCount());
        console2.log("BINDING_FINGERPRINT:", Trunc.hashShort(c.bindingFingerprint()));
    }
}
