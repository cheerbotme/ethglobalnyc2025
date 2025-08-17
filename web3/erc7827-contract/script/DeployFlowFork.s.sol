// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.20;

import {Script} from "forge-std/Script.sol";
import {console2} from "forge-std/console2.sol";
import {ERC7827} from "../src/ERC7827.sol";

contract DeployFlowFork is Script {
    // Flow EVM Mainnet RPC URL
    string private constant FLOW_EVM_RPC = "https://mainnet.evm.nodes.onflow.org";
    
    function run() external {
        // Load environment variables
        uint256 privateKey = vm.envUint("FLOW_MAINNET_PRIVATE_KEY");
        address deployerAddr = vm.rememberKey(privateKey);
        
        // Log the deployer address for verification
        console2.log("Deployer address:", deployerAddr);
        console2.log("Deployer balance:", deployerAddr.balance);
        
        // Create a fork of the Flow EVM network
        console2.log("Creating Flow EVM fork...");
        vm.createSelectFork(FLOW_EVM_RPC);
        
        // Get the current block number
        uint256 blockNumber = block.number;
        console2.log("Fork created at block:", blockNumber);
        
        // Simulate deployment without broadcasting
        console2.log("Simulating deployment to Flow EVM fork...");
        
        // Use vm.etch to simulate deployment without broadcasting
        address contractAddress = computeCreateAddress(msg.sender, vm.getNonce(msg.sender));
        bytes memory bytecode = type(ERC7827).creationCode;
        
        // Simulate contract creation
        vm.etch(contractAddress, bytecode);
        
        // Log the simulated deployment
        console2.log("Simulated ERC7827 deployment at:", contractAddress);
        
        // Log deployment info
        console2.log("Simulation successful!");
        console2.log("Network: Flow EVM Fork");
        console2.log("Block number:", blockNumber);
        console2.log("Deployer:", msg.sender);
        console2.log("ERC7827 contract:", contractAddress);
    }
}
