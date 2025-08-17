// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import { IERC7827 } from "./IERC7827.sol";

/**
 * @title ERC7827_NoOwner - A Permissionless Version of ERC7827
 * @dev Manages a JSON object with version-controlled values, accessible via a REST-like interface.
 *      Write operations are permissionless and can be called by any account.
 */
contract ERC7827_NoOwner is IERC7827 {
    mapping(string => string[]) private _versions;
    mapping(string => bool) private _hasKey;
    string[] private _keys;

    /**
     * @notice Writes new values to the JSON object. This function is permissionless.
     * @inheritdoc IERC7827
     */
    function write(
        string[] calldata keys,
        string[] calldata values,
        bool replace
    ) external {
        require(keys.length == values.length, "Array lengths must match");

        for (uint i = 0; i < keys.length; i++) {
            string memory key = keys[i];
            string memory value = values[i];

            if (_hasKey[key]) {
                require(replace, "Key exists and replace is false");
                _versions[key].push(value);
            } else {
                _versions[key].push(value);
                _hasKey[key] = true;
                _keys.push(key);
            }
        }
    }

    /**
     * @notice Returns the JSON object in its latest state.
     * @inheritdoc IERC7827
     */
    function json() external view returns (string memory) {
        if (_keys.length == 0) {
            return "{}";
        }

        bytes memory jsonObj = bytes("{");
        for (uint i = 0; i < _keys.length; i++) {
            string memory key = _keys[i];
            string[] storage keyVersions = _versions[key];
            string memory latestValue = keyVersions[keyVersions.length - 1];

            jsonObj = abi.encodePacked(
                jsonObj,
                '"',
                _escape(key),
                '":',
                _quote(latestValue)
            );

            if (i < _keys.length - 1) {
                jsonObj = abi.encodePacked(jsonObj, ",");
            }
        }
        jsonObj = abi.encodePacked(jsonObj, "}");

        return string(jsonObj);
    }

    /**
     * @notice Returns the version history of a specific key.
     * @inheritdoc IERC7827
     */
    function version(string calldata key) external view returns (string memory) {
        string[] storage keyVersions = _versions[key];
        if (keyVersions.length == 0) {
            return "[]";
        }

        bytes memory jsonArray = bytes("[");
        for (uint i = 0; i < keyVersions.length; i++) {
            jsonArray = abi.encodePacked(
                jsonArray,
                _quote(keyVersions[i])
            );
            if (i < keyVersions.length - 1) {
                jsonArray = abi.encodePacked(jsonArray, ",");
            }
        }
        jsonArray = abi.encodePacked(jsonArray, "]");

        return string(jsonArray);
    }
    
    // --- Internal Helper Functions ---

    function _quote(string memory s) private pure returns (string memory) {
        bytes memory b = bytes(s);
        if (
            (b.length > 0 && (b[0] == '{' || b[0] == '[' || b[0] == '"')) ||
            _isNumeric(s) ||
            _isBoolean(s) ||
            _isNull(s)
        ) {
            return s;
        }
        return string(abi.encodePacked('"', _escape(s), '"'));
    }

    function _escape(string memory s) private pure returns (string memory) {
        bytes memory b = bytes(s);
        bytes memory result = new bytes(b.length * 2);
        uint j = 0;
        for (uint i = 0; i < b.length; i++) {
            if (b[i] == '"') {
                result[j++] = '\\';
            }
            result[j++] = b[i];
        }

        bytes memory finalResult = new bytes(j);
        for (uint i = 0; i < j; i++) {
            finalResult[i] = result[i];
        }
        return string(finalResult);
    }

    function _isBoolean(string memory s) private pure returns (bool) {
        return keccak256(abi.encodePacked(s)) == keccak256("true") || keccak256(abi.encodePacked(s)) == keccak256("false");
    }

    function _isNull(string memory s) private pure returns (bool) {
        return keccak256(abi.encodePacked(s)) == keccak256("null");
    }

    function _isNumeric(string memory s) private pure returns (bool) {
        bytes memory b = bytes(s);
        if (b.length == 0) return false;
        for (uint i = 0; i < b.length; i++) {
            bool isDigit = (b[i] >= 0x30 && b[i] <= 0x39);
            bool isMinus = (i == 0 && b[i] == '-');
            if (!isDigit && !isMinus) {
                return false;
            }
        }
        return true;
    }
}
