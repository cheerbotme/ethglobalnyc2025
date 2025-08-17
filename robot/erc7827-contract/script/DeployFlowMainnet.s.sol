// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import {Script} from "forge-std/Script.sol";
import {console2} from "forge-std/console2.sol";
import {ERC7827} from "../src/ERC7827.sol";

/**
 * @title DeployFlowMainnet
 * @notice Deployment script for ERC7827 contract on Flow Mainnet
 * @dev Uses regular deployment for Flow EVM compatibility
 */
contract DeployFlowMainnet is Script {
    // Deployment addresses
    address public erc7827Address;

    // Flow Mainnet configuration
    uint256 private constant FLOW_MAINNET_CHAIN_ID = 747;
    string private constant FLOW_MAINNET_RPC = "https://mainnet.evm.nodes.onflow.org";

    // Deployer address (will be set as owner)
    address private deployer;

    function run() external {
        // Load environment variables
        uint256 deployerPrivateKey = vm.envUint("FLOW_MAINNET_PRIVATE_KEY");
        
        // Set the chain ID for the deployment
        uint256 chainId = block.chainid;
        if (chainId != FLOW_MAINNET_CHAIN_ID) {
            // Only set chain ID if we're not already on the correct chain
            vm.chainId(FLOW_MAINNET_CHAIN_ID);
        }
        
        // Get the deployer address
        deployer = vm.rememberKey(deployerPrivateKey);
        console2.log("Deploying with address:", deployer);
        
        // Get the deployer's balance
        uint256 balance = deployer.balance;
        console2.log("Deployer balance:", balance / 1e18, "FLOW");
        
        if (balance == 0) {
            revert("Deployer has zero balance. Please fund the deployer address with FLOW tokens.");
        }

        console2.log("\nStarting deployment to Flow Mainnet...");
        
        // Start broadcasting transactions with the deployer's private key
        vm.startBroadcast(deployerPrivateKey);
        
        // Deploy the contract
        console2.log("Deploying ERC7827 contract...");
        ERC7827 erc7827 = new ERC7827();
        erc7827Address = address(erc7827);
        
        // Log deployment details
        console2.log("\n[SUCCESS] Deployment successful!");
        console2.log("Contract address:", erc7827Address);
        console2.log("Deployer:", deployer);
        console2.log("Network: Flow Mainnet");
        console2.log("Chain ID:", FLOW_MAINNET_CHAIN_ID);
        console2.log("Explorer: https://flowdiver.io/");
        
        // Save deployment addresses
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
        // Use relative path for better compatibility
        string memory deploymentsDir = "deployments/flow-mainnet";
        
        // Create the directory if it doesn't exist
        string[] memory mkdirCmd = new string[](3);
        mkdirCmd[0] = "mkdir";
        mkdirCmd[1] = "-p";
        mkdirCmd[2] = deploymentsDir;
        
        try vm.ffi(mkdirCmd) {
            // Directory created successfully
        } catch {
            console2.log("Warning: Could not create deployments directory. Files will not be saved.");
            return;
        }
        
        // Prepare deployment info
        string memory deploymentJson = string(abi.encodePacked(
            '{\n  "name": "ERC7827",\n  "chainId": ', vm.toString(FLOW_MAINNET_CHAIN_ID), ',\n  "network": "flow-mainnet",\n  "address": "', vm.toString(erc7827Address), '",\n  "deployer": "', vm.toString(deployer), '",\n  "deployedAt": ', vm.toString(block.timestamp), '\n}'
        ));
        
        // Write deployment info to file
        string memory deploymentPath = string(abi.encodePacked(deploymentsDir, "/deployment.json"));
        
        try vm.writeFile(deploymentPath, deploymentJson) {
            console2.log("Deployment info saved to:", deploymentPath);
            
            // Also save the address to a simple addresses.json file
            string memory addressesPath = string(abi.encodePacked(deploymentsDir, "/addresses.json"));
            string memory addressesJson = string(abi.encodePacked(
                '{\n  "erc7827": "', vm.toString(erc7827Address), '"\n}'
            ));
            vm.writeFile(addressesPath, addressesJson);
        } catch {
            console2.log("Warning: Could not save deployment files. The deployment was successful, but the addresses were not saved to disk.");
        }
    }
}
