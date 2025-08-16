// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import { Test, console2 } from "forge-std/Test.sol";
import { ERC7827 } from "../src/ERC7827.sol";

contract ERC7827Test is Test {
    ERC7827 public erc7827;
    address private owner;
    address private nonOwner;

    function setUp() public {
        owner = address(this);
        nonOwner = address(0x123);
        vm.prank(owner);
        erc7827 = new ERC7827();
    }

    function test_initialJsonIsEmpty() public view {
        assertEq(erc7827.json(), "{}");
    }

    function test_initialVersionIsEmpty() public view {
        assertEq(erc7827.version("anykey"), "[]");
    }

    function test_write_singleKeyValue() public {
        vm.prank(owner);
        string[] memory keys = new string[](1);
        keys[0] = "name";
        string[] memory values = new string[](1);
        values[0] = "Alice";

        erc7827.write(keys, values, false);

        assertEq(erc7827.json(), '{"name":"Alice"}');
        assertEq(erc7827.version("name"), '["Alice"]');
    }

    function test_write_multipleKeyValues() public {
        vm.prank(owner);
        string[] memory keys = new string[](2);
        keys[0] = "name";
        keys[1] = "age";
        string[] memory values = new string[](2);
        values[0] = "Alice";
        values[1] = "30";

        erc7827.write(keys, values, false);

        assertEq(erc7827.json(), '{"name":"Alice","age":30}');
    }

    function test_write_updateValueWithReplace() public {
        vm.prank(owner);
        // Initial write
        string[] memory keys1 = new string[](1);
        keys1[0] = "name";
        string[] memory values1 = new string[](1);
        values1[0] = "Alice";
        erc7827.write(keys1, values1, false);

        // Update write
        string[] memory keys2 = new string[](1);
        keys2[0] = "name";
        string[] memory values2 = new string[](1);
        values2[0] = "Bob";
        erc7827.write(keys2, values2, true);

        assertEq(erc7827.json(), '{"name":"Bob"}');
        assertEq(erc7827.version("name"), '["Alice","Bob"]');
    }

    function test_revert_on_write_existingKeyWithoutReplace() public {
        vm.prank(owner);
        // Initial write
        string[] memory keys = new string[](1);
        keys[0] = "name";
        string[] memory values = new string[](1);
        values[0] = "Alice";
        erc7827.write(keys, values, false);

        // Expect revert on second write
        vm.expectRevert("Key exists and replace is false");
        erc7827.write(keys, values, false);
    }

    function test_revert_on_write_mismatchedArrayLengths() public {
        vm.prank(owner);
        string[] memory keys = new string[](2);
        keys[0] = "name";
        keys[1] = "age";
        string[] memory values = new string[](1);
        values[0] = "Alice";

        vm.expectRevert("Array lengths must match");
        erc7827.write(keys, values, false);
    }

    function test_json_withDifferentDataTypes() public {
        vm.prank(owner);
        string[] memory keys = new string[](4);
        keys[0] = "name";
        keys[1] = "age";
        keys[2] = "isStudent";
        keys[3] = "courses";
        string[] memory values = new string[](4);
        values[0] = "Charlie";
        values[1] = "25";
        values[2] = "true";
        values[3] = '["Math","History"]'; // JSON array as a string

        erc7827.write(keys, values, false);

        string memory expectedJson = '{"name":"Charlie","age":25,"isStudent":true,"courses":["Math","History"]}';
        assertEq(erc7827.json(), expectedJson);
    }

     function test_version_multipleUpdates() public {
        vm.prank(owner);
        string[] memory keys = new string[](1);
        keys[0] = "status";
        
        string[] memory values1 = new string[](1);
        values1[0] = "Pending";
        erc7827.write(keys, values1, false);

        string[] memory values2 = new string[](1);
        values2[0] = "Processing";
        erc7827.write(keys, values2, true);

        string[] memory values3 = new string[](1);
        values3[0] = "Completed";
        erc7827.write(keys, values3, true);

        assertEq(erc7827.version("status"), '["Pending","Processing","Completed"]');
    }

    function test_write_keyWithSpecialChars() public {
        vm.prank(owner);
        string[] memory keys = new string[](1);
        keys[0] = "user:profile/1";
        string[] memory values = new string[](1);
        values[0] = "data";

        erc7827.write(keys, values, false);
        assertEq(erc7827.json(), '{"user:profile/1":"data"}');
    }

    function test_write_valueWithQuotes() public {
        vm.prank(owner);
        string[] memory keys = new string[](1);
        keys[0] = "quote";
        string[] memory values = new string[](1);
        values[0] = 'He said "Hello!"';

        erc7827.write(keys, values, false);
        assertEq(erc7827.json(), '{"quote":"He said \\"Hello!\\""}');
    }

    function test_revert_on_write_ifNotOwner() public {
        vm.prank(nonOwner);
        string[] memory keys = new string[](1);
        keys[0] = "name";
        string[] memory values = new string[](1);
        values[0] = "Alice";
        vm.expectRevert(abi.encodeWithSignature("OwnableUnauthorizedAccount(address)", nonOwner));
        erc7827.write(keys, values, false);
    }

    function test_totalKeys() public {
        vm.prank(owner);
        assertEq(erc7827.totalKeys(), 0);

        string[] memory keys = new string[](2);
        keys[0] = "name";
        keys[1] = "age";
        string[] memory values = new string[](2);
        values[0] = "Alice";
        values[1] = "30";
        erc7827.write(keys, values, false);
        assertEq(erc7827.totalKeys(), 2);
    }

    function test_valueAt() public {
        vm.prank(owner);
        string[] memory keys = new string[](1);
        keys[0] = "status";
        
        string[] memory values1 = new string[](1);
        values1[0] = "Pending";
        erc7827.write(keys, values1, false);

        string[] memory values2 = new string[](1);
        values2[0] = "Completed";
        erc7827.write(keys, values2, true);

        assertEq(erc7827.valueAt("status", 0), "Pending");
        assertEq(erc7827.valueAt("status", 1), "Completed");
    }

    function test_revert_on_valueAt_invalidKey() public {
        vm.expectRevert("Key does not exist");
        erc7827.valueAt("nonexistent", 0);
    }

    function test_revert_on_valueAt_indexOutOfBounds() public {
        vm.prank(owner);
        string[] memory keys = new string[](1);
        keys[0] = "name";
        string[] memory values = new string[](1);
        values[0] = "Alice";
        erc7827.write(keys, values, false);

        vm.expectRevert("Version index out of bounds");
        erc7827.valueAt("name", 1);
    }
}
