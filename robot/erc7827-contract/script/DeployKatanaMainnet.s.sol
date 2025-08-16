// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.20;

import {Script} from "forge-std/Script.sol";
import {console2} from "forge-std/console2.sol";
import {ERC7827} from "../src/ERC7827.sol";

contract DeployKatanaMainnet is Script {
    // Katana Mainnet configuration
    uint256 private constant KATANA_MAINNET_CHAIN_ID = 2020; // Ronin Mainnet
    string private constant KATANA_MAINNET_RPC = "https://api.roninchain.com/rpc";
    
    function run() external {
        // Load environment variables
        uint256 deployerPrivateKey = vm.envUint("KATANA_MAINNET_PRIVATE_KEY");
        
        // Set up the RPC URL for Katana Mainnet
        vm.chainId(KATANA_MAINNET_CHAIN_ID);
        vm.createSelectFork(KATANA_MAINNET_RPC);
        
        // Start broadcasting transactions
        vm.startBroadcast(deployerPrivateKey);
        
        // Deploy the contract
        ERC7827 erc7827 = new ERC7827();
        
        // Log the deployed address
        console2.log("ERC7827 deployed to:", address(erc7827));
        console2.log("Network: Katana Mainnet (Ronin)");
        console2.log("Chain ID:", KATANA_MAINNET_CHAIN_ID);
        console2.log("Explorer: https://app.roninchain.com/");
        
        vm.stopBroadcast();
    }
}
