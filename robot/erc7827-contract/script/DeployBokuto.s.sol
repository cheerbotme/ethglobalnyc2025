// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import {Script} from "forge-std/Script.sol";
import {console2} from "forge-std/console2.sol";
import {ERC7827} from "../src/ERC7827.sol";

contract DeployBokuto is Script {
    // Katana Bokuto Testnet configuration
    uint256 private constant BOKUTO_CHAIN_ID = 1261120;
    string private constant BOKUTO_RPC = "https://rpc.bokuto.katana.network/";
    
    function run() external {
        // Load environment variables
        uint256 deployerPrivateKey = vm.envUint("BOKUTO_PRIVATE_KEY");
        
        // Set up the RPC URL for Katana Bokuto Testnet
        vm.chainId(BOKUTO_CHAIN_ID);
        vm.createSelectFork(BOKUTO_RPC);
        
        // Start broadcasting transactions
        vm.startBroadcast(deployerPrivateKey);
        
        // Deploy ERC7827 contract
        ERC7827 erc7827 = new ERC7827();
        
        // Log the deployed address
        console2.log("ERC7827 deployed to:", address(erc7827));
        console2.log("Network: Katana Bokuto Testnet");
        console2.log("Chain ID:", BOKUTO_CHAIN_ID);
        console2.log("Explorer: https://bokuto.katana.network/");
        
        vm.stopBroadcast();
    }
}
