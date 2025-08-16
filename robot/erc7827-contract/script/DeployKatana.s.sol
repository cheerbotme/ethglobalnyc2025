// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.20;

import {Script} from "forge-std/Script.sol";
import {console2} from "forge-std/console2.sol";
import {ERC7827} from "../src/ERC7827.sol";

contract DeployKatana is Script {
    // Katana testnet (Saigon) configuration
    uint256 private constant KATANA_CHAIN_ID = 2021; // Saigon Testnet
    string private constant KATANA_RPC = "https://saigon-testnet.roninchain.com/rpc";
    
    function run() external {
        // Load environment variables
        uint256 deployerPrivateKey = vm.envUint("KATANA_PRIVATE_KEY");
        
        // Set up the RPC URL for Katana
        vm.chainId(KATANA_CHAIN_ID);
        vm.createSelectFork(KATANA_RPC);
        
        // Start broadcasting transactions
        vm.startBroadcast(deployerPrivateKey);
        
        // Deploy the contract
        ERC7827 erc7827 = new ERC7827();
        
        // Log the deployed address
        console2.log("ERC7827 deployed to:", address(erc7827));
        console2.log("Network: Katana Testnet (Saigon)");
        console2.log("Chain ID:", KATANA_CHAIN_ID);
        console2.log("Explorer: https://saigon-app.roninchain.com/");
        
        vm.stopBroadcast();
    }
}
