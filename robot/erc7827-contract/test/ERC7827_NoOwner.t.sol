// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import { Test, console2 } from "forge-std/Test.sol";
import { ERC7827_NoOwner } from "../src/ERC7827_NoOwner.sol";

contract ERC7827_NoOwnerTest is Test {
    ERC7827_NoOwner public erc7827NoOwner;
    address private someUser = address(0x123);

    function setUp() public {
        erc7827NoOwner = new ERC7827_NoOwner();
    }

    function test_initialJsonIsEmpty() public view {
        assertEq(erc7827NoOwner.json(), "{}");
    }

    function test_write_singleKeyValue() public {
        string[] memory keys = new string[](1);
        keys[0] = "name";
        string[] memory values = new string[](1);
        values[0] = "Alice";

        erc7827NoOwner.write(keys, values, false);

        assertEq(erc7827NoOwner.json(), '{"name":"Alice"}');
        assertEq(erc7827NoOwner.version("name"), '["Alice"]');
    }

    function test_write_allowsAnyUser() public {
        vm.prank(someUser);
        
        string[] memory keys = new string[](1);
        keys[0] = "message";
        string[] memory values = new string[](1);
        values[0] = "Hello from anyone";

        erc7827NoOwner.write(keys, values, false);
        
        assertEq(erc7827NoOwner.json(), '{"message":"Hello from anyone"}');
    }

    function test_write_multipleUpdatesFromDifferentUsers() public {
        address user1 = address(0x1);
        address user2 = address(0x2);

        vm.prank(user1);
        erc7827NoOwner.write(
            _array("status"),
            _array("pending"),
            false
        );

        vm.prank(user2);
        erc7827NoOwner.write(
            _array("status"),
            _array("approved"),
            true 
        );

        assertEq(erc7827NoOwner.version("status"), '["pending","approved"]');
    }

    // Helper function to create a string array with one element
    function _array(string memory _str) private pure returns (string[] memory) {
        string[] memory arr = new string[](1);
        arr[0] = _str;
        return arr;
    }
}
