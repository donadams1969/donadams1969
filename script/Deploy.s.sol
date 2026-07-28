// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import "forge-std/Script.sol";
import "../src/SGAU_VALUEGUARD_77_77X_FINALDEG.sol";
import "../src/Trunc.sol";

contract DeployScript is Script {
    function run() external returns (SGAU_VALUEGUARD_77_77X_FINALDEG deployed) {
        uint256 pk = vm.envUint("PRIVATE_KEY");

        address initialOwner = vm.addr(pk);
        bool startFrozen = true;

        vm.startBroadcast(pk);
        deployed = new SGAU_VALUEGUARD_77_77X_FINALDEG(initialOwner, startFrozen);
        vm.stopBroadcast();

        console2.log("DEPLOYED_SGAU_VALUEGUARD:", Trunc.addrShort(address(deployed)));
        console2.log("OWNER:", Trunc.addrShort(deployed.owner()));
        console2.log("FROZEN:", deployed.transfersFrozen());
        console2.log("ENS_ANCHOR:", deployed.ENS_ANCHOR());
        console2.log("TREASURY_ANCHOR:", Trunc.addrShort(deployed.TREASURY_ANCHOR()));
    }
}
