// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract MyContract {
    string public message = "Hello, Remix!";

    function setMessage(string calldata _msg) public {
        message = _msg;
    }
}

