// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

/**
 * @title IERC7827 JSON Smart Contract with Value Version Control
 * @dev Interface for a smart contract that manages a JSON object with version-controlled values.
 */
interface IERC7827 {
    /**
     * @notice Returns the JSON object in its latest state.
     * @return A string representing the complete JSON object.
     */
    function json() external view returns (string memory);

    /**
     * @notice Returns the version history of a specific key.
     * @param key The JSON key whose version history is requested.
     * @return A JSON array string with all historical values for the key.
     */
    function version(string calldata key) external view returns (string memory);

    /**
     * @notice Writes new values to the JSON object.
     * @param keys Array of JSON keys.
     * @param values Array of JSON-compatible string values.
     * @param replace If true, replaces the latest value of an existing key. If false, reverts if the key exists.
     */
    function write(
        string[] calldata keys,
        string[] calldata values,
        bool replace
    ) external;
}
