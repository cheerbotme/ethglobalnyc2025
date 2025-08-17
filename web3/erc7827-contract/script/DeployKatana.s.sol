// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import {Script} from "forge-std/Script.sol";
import {console2} from "forge-std/console2.sol";
import {ERC7827} from "../src/ERC7827.sol";

contract DeployKatana is Script {
    // Katana Mainnet configuration
    uint256 private constant KATANA_CHAIN_ID = 747474;
    string private constant KATANA_RPC = "https://rpc.katana.network/";
    
    function run() external {
        // Load environment variables
        uint256 deployerPrivateKey = vm.envUint("PRIVATE_KEY");
        
        // Set up the RPC URL for Katana Mainnet
        vm.chainId(KATANA_CHAIN_ID);
        vm.createSelectFork(KATANA_RPC);
        
        // Start broadcasting transactions
        vm.startBroadcast(deployerPrivateKey);
        
        // Deploy ERC7827 contract
        ERC7827 erc7827 = new ERC7827();
        
        // Log the deployed address
        console2.log("ERC7827 deployed to:", address(erc7827));
        console2.log("Network: Katana Mainnet");
        console2.log("Chain ID:", KATANA_CHAIN_ID);
        console2.log("Explorer: https://katanascan.com/");
        
        vm.stopBroadcast();
    }
}
