// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.20;

import {Script} from "forge-std/Script.sol";
import {console2} from "forge-std/console2.sol";
import {ERC7827} from "../src/ERC7827.sol";

contract DeployKatanaFork is Script {
    // Katana RPC URL
    string private constant KATANA_RPC = "https://api.roninchain.com/rpc";
    
    function run() external {
        // Create a fork of the Katana network
        console2.log("Creating Katana fork...");
        vm.createSelectFork(KATANA_RPC);
        
        // Get the current block number
        uint256 blockNumber = block.number;
        console2.log("Fork created at block:", blockNumber);
        
        // Simulate deployment without broadcasting
        console2.log("Simulating deployment to Katana fork...");
        
        // Use vm.etch to simulate deployment without broadcasting
        address contractAddress = vm.computeCreateAddress(msg.sender, vm.getNonce(msg.sender));
        bytes memory bytecode = type(ERC7827).creationCode;
        
        // Simulate contract creation
        vm.etch(contractAddress, bytecode);
        
        // Log the simulated deployment
        console2.log("Simulated ERC7827 deployment at:", contractAddress);
        
        // Log deployment info
        console2.log("Simulation successful!");
        console2.log("Network: Katana Fork");
        console2.log("Block number:", blockNumber);
        console2.log("Deployer:", msg.sender);
        console2.log("ERC7827 contract:", contractAddress);
    }
}
