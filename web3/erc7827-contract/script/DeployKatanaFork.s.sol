// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import {Script} from "forge-std/Script.sol";
import {console2} from "forge-std/console2.sol";
import {ERC7827} from "../src/ERC7827.sol";

contract DeployKatanaFork is Script {
    // Katana Mainnet RPC URL
    string private constant KATANA_RPC = "https://rpc.katana.network/";
    
    function run() external {
        // Create a fork of the Katana network
        console2.log("Creating Katana fork...");
        vm.chainId(747474); // Katana Mainnet chain ID
        vm.createSelectFork(KATANA_RPC);
        
        // Get the current block number
        uint256 blockNumber = block.number;
        console2.log("Fork created at block:", blockNumber);
        
        // Simulate deployment without broadcasting
        console2.log("Simulating deployment to Katana fork...");
        
        // Use vm.etch to simulate deployment without broadcasting
        address contractAddress = vm.computeCreateAddress(msg.sender, vm.getNonce(msg.sender));
        
        // Create a mock contract at the computed address
        vm.etch(contractAddress, type(ERC7827).runtimeCode);
        
        // Log deployment info
        console2.log("Simulation successful!");
        console2.log("Network: Katana Mainnet Fork");
        console2.log("Chain ID: 747474");
        console2.log("Block number:", blockNumber);
        console2.log("Deployer:", msg.sender);
        console2.log("ERC7827 contract:", contractAddress);
        console2.log("Explorer: https://katanascan.com/");
    }
}
