// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

library Trunc {
    function addrShort(address a) internal pure returns (string memory) {
        bytes20 b = bytes20(a);
        bytes4 head = bytes4(b);               // first 4 bytes
        bytes4 tail = bytes4(b << 128);        // last 4 bytes
        return string(
            abi.encodePacked(
                "0x",
                _hex8(head),
                "…",
                _hex8(tail)
            )
        );
    }

    function hashShort(bytes32 h) internal pure returns (string memory) {
        bytes4 head = bytes4(h);
        bytes4 tail = bytes4(h << 224);
        return string(
            abi.encodePacked(
                "0x",
                _hex8(head),
                "…",
                _hex8(tail)
            )
        );
    }

    function _hex8(bytes4 data) private pure returns (string memory) {
        bytes memory alphabet = "0123456789abcdef";
        bytes memory str = new bytes(8);
        for (uint256 i = 0; i < 4; i++) {
            uint8 v = uint8(data[i]);
            str[i * 2] = alphabet[v >> 4];
            str[i * 2 + 1] = alphabet[v & 0x0f];
        }
        return string(str);
    }
}
