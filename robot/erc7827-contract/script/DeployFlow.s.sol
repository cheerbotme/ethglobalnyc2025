// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import {Script} from "forge-std/Script.sol";
import {console2} from "forge-std/console2.sol";
import {ERC7827} from "../src/ERC7827.sol";

/**
 * @title DeployFlow
 * @notice Deployment script for ERC7827 contract on Flow EVM
 * @dev Uses regular deployment for Flow EVM compatibility
 */
contract DeployFlow is Script {
    // Deployment addresses
    address public erc7827Address;
    
    // Flow Testnet configuration
    uint256 private constant FLOW_TESTNET_CHAIN_ID = 356256156;
    string private constant FLOW_TESTNET_RPC = "https://testnet.evm.nodes.onflow.org";
    
    // Deployer address (will be set as owner)
    address private deployer;

    function run() external {
        // Load environment variables
        uint256 deployerPrivateKey = vm.envUint("FLOW_TESTNET_PRIVATE_KEY");
        
        // Set up the RPC URL for Flow Testnet
        vm.chainId(FLOW_TESTNET_CHAIN_ID);
        vm.createSelectFork(FLOW_TESTNET_RPC);
        
        // Start broadcasting transactions
        vm.startBroadcast(deployerPrivateKey);

        // Set deployer address
        deployer = vm.addr(deployerPrivateKey);
        console2.log("Deploying with address:", deployer);
        
        // Deploy contract
        deployERC7827();

        console2.log("\nDeployment complete!");
        console2.log("ERC7827 deployed at:", erc7827Address);
        console2.log("Network: Flow Testnet");
        console2.log("Chain ID:", FLOW_TESTNET_CHAIN_ID);
        console2.log("Explorer: https://testnet.flowdiver.io/");

        // Save deployment addresses to JSON file
        saveDeploymentAddresses();

        vm.stopBroadcast();
    }

    function deployERC7827() internal {
        console2.log("\nDeploying ERC7827...");
        ERC7827 erc7827 = new ERC7827();
        erc7827Address = address(erc7827);
        console2.log("ERC7827 deployed at:", erc7827Address);
    }

    function saveDeploymentAddresses() internal {
        string memory json = string(
            abi.encodePacked(
                "{\n",
                '  "chainId": 747,\n', // Flow Mainnet chain ID
                '  "deployer": "',
                vm.toString(deployer),
                '",\n',
                '  "contracts": {\n',
                '    "erc7827": "',
                vm.toString(erc7827Address),
                '"\n',
                '  }\n',
                '}'
            )
        );

        string memory dir = "deployments";
        string memory filename = string(abi.encodePacked(dir, "/flow-addresses.json"));
        
        // Create directory if it doesn't exist
        string[] memory ffiCmd = new string[](3);
        ffiCmd[0] = "sh";
        ffiCmd[1] = "-c";
        ffiCmd[2] = string(abi.encodePacked("mkdir -p ", dir));
        vm.ffi(ffiCmd);
        
        vm.writeFile(filename, json);
        console2.log("Deployment addresses saved to:", filename);
    }
}
