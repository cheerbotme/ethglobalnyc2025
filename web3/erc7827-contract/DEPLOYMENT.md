# ERC7827 Contract Deployment Guide

This document provides instructions for deploying the ERC7827 contract to various testnets.

## Prerequisites

1. Install Foundry:
   ```bash
   curl -L https://foundry.paradigm.xyz | bash
   foundryup
   ```

2. Install Node.js and npm

3. Install Flow CLI (for Flow deployment):
   ```bash
   sh -ci "$(curl -fsSL https://storage.googleapis.com/flow-cli/install.sh)"
   ```

## Local Testing with Anvil

Anvil is a local testnet node included with Foundry that allows you to test your contracts in a local environment.

### Starting Anvil

```bash
# Start Anvil with default settings (creates 10 test accounts with 10,000 ETH each)
anvil
```

If you encounter a port conflict, you can specify a different port:

```bash
anvil -p 8545  # Use port 8545 instead of default 8545
```

### Deploying to Local Anvil Node

In a new terminal:

```bash
# Set the RPC URL to your local Anvil node
export ANVIL_RPC_URL=http://127.0.0.1:8545

# Use the first Anvil private key for deployment
export PRIVATE_KEY=0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80

# Deploy to local Anvil
forge script script/Deploy.s.sol --rpc-url $ANVIL_RPC_URL --broadcast
```

### Forking Mainnet for Testing

You can also fork a mainnet (like Ethereum) for more realistic testing:

```bash
# Fork Ethereum mainnet
anvil --fork-url https://eth-mainnet.g.alchemy.com/v2/YOUR_API_KEY

# Or fork Flow mainnet
anvil --fork-url https://mainnet.evm.nodes.onflow.org

# Then deploy as shown above
```

## Environment Setup

Create a `.env` file in the project root with the following variables:

```
# For Sepolia
PRIVATE_KEY=your_private_key_here
SEPOLIA_RPC_URL=your_sepolia_rpc_url

# For Katana
KATANA_PRIVATE_KEY=your_katana_private_key

# For Flow (optional)
FLOW_ACCOUNT=your_flow_account
FLOW_PRIVATE_KEY=your_flow_private_key
```

## Deploying to Sepolia

1. Set up your `.env` file with the required variables
2. Run the deployment script:
   ```bash
   forge script script/Deploy.s.sol:DeployScript --rpc-url $SEPOLIA_RPC_URL --broadcast --verify -vvvv
   ```

## Deploying to Katana

1. Set up your `.env` file with the required variables
2. Run the deployment script:
   ```bash
   forge script script/DeployKatana.s.sol:DeployKatana --rpc-url $KATANA_RPC --broadcast -vvvv
   ```

## Deploying to Flow

Note: This requires implementing the contract in Cadence first.

1. Install the Flow CLI if you haven't already
2. Create a new Flow account:
   ```bash
   flow accounts create --network testnet
   ```
3. Deploy the contract:
   ```bash
   flow project deploy --network testnet
   ```

## Verifying Contracts

This section outlines the commands used to verify the deployed `ERC7827` smart contract on different blockchain explorers.

### Katana Tatara Testnet

To verify the contract on the Katana Tatara testnet explorer, use the following command. You will need to replace `<DEPLOYED_ADDRESS>` with the actual address of your deployed contract.

```bash
forge verify-contract <DEPLOYED_ADDRESS> src/ERC7827.sol:ERC7827 --chain-id 747 --verifier blockscout --verifier-url https://explorer.tatara.katana.network/api -vvvv
```

**Example:**
```bash
forge verify-contract 0x77331C208e7a6d4C05b0A0f87dB2Df9f154321a8 src/ERC7827.sol:ERC7827 --chain-id 747 --verifier blockscout --verifier-url https://explorer.tatara.katana.network/api -vvvv
```

### Flow Mainnet

To verify the contract on the Flow mainnet explorer, use the following command. Replace `<DEPLOYED_ADDRESS>` with your contract's address.

```bash
forge verify-contract <DEPLOYED_ADDRESS> src/ERC7827.sol:ERC7827 --chain-id 747 --verifier blockscout --verifier-url https://evm.flowscan.io/api -vvvv
```

**Example:**
```bash
forge verify-contract 0x04B386e36F89E5bB568295779089E91ded070057 src/ERC7827.sol:ERC7827 --chain-id 747 --verifier blockscout --verifier-url https://evm.flowscan.io/api -vvvv
```



## Network Information

### Ethereum Sepolia Testnet
- **Chain ID**: 11155111
- **RPC URL**: `https://rpc.sepolia.org`
- **Explorer**: [Sepolia Explorer](https://sepolia.etherscan.io/)
- **Faucet**: [Alchemy Sepolia Faucet](https://sepoliafaucet.com/)
- **Currency Symbol**: ETH
- **Block Time**: ~12 seconds

### Katana Mainnet
- **Chain ID**: 747474
- **RPC URL**: `https://rpc.katana.network/`
- **Explorer**: [KatanaScan](https://katanascan.com/)
- **Currency Symbol**: KAT
- **Block Time**: ~2 seconds

### Katana Tatara Testnet
- **Chain ID**: 747
- **RPC URL**: `https://rpc.tatara.katana.network/`
- **Explorer**: [Tatara Explorer](https://tatara.katana.network/)
- **Faucet**: [Katana Faucet](https://faucet.katana.network/)
- **Currency Symbol**: tKAT
- **Block Time**: ~2 seconds

### Katana Bokuto Testnet
- **Chain ID**: 1261120
- **RPC URL**: `https://rpc.bokuto.katana.network/`
- **Explorer**: [Bokuto Explorer](https://bokuto.katana.network/)
- **Faucet**: [Katana Faucet](https://faucet.katana.network/)
- **Currency Symbol**: tKAT
- **Block Time**: ~2 seconds

### Flow EVM Testnet
- **Chain ID**: 356256156
- **RPC URL**: `https://testnet.evm.nodes.onflow.org`
- **Explorer**: [Flowdiver](https://testnet.flowdiver.io/)
- **Documentation**: [Flow EVM Docs](https://developers.flow.com/evm)
- **Faucet**: Available in Flow Discord #faucet channel
- **Chain Name**: Flow Testnet
- **Currency Symbol**: tFLOW
- **Block Time**: ~5 seconds

### Flow EVM Mainnet
- **Chain ID**: 747
- **RPC URL**: `https://mainnet.evm.nodes.onflow.org`
- **Explorer**: [Flowdiver](https://flowdiver.io/)
- **Documentation**: [Flow EVM Docs](https://developers.flow.com/evm)
- **Chain Name**: Flow Mainnet
- **Currency Symbol**: FLOW
- **Block Time**: ~5 seconds
- **Wrapped FLOW**: 0x1654653399040a61
- **Gas Token**: FLOW (native)

#### Deploying to Flow Mainnet

1. **Prerequisites**:
   - Sufficient FLOW tokens for gas (recommend at least 10 FLOW)
   - Private key with FLOW balance in a secure environment

2. **Environment Setup**:
   ```bash
   # In your .env file
   FLOW_MAINNET_RPC_URL=https://evm.flow-mainnet.starknet.io
   FLOW_MAINNET_PRIVATE_KEY=your_private_key_here
   ```

3. **Deployment Command**:
   ```bash
   forge script script/DeployFlow.s.sol:DeployFlow \
     --rpc-url $FLOW_MAINNET_RPC_URL \
     --private-key $FLOW_MAINNET_PRIVATE_KEY \
     --broadcast \
     --verify \
     --etherscan-api-key $FLOWSCAN_API_KEY \
     -vvvv
   ```

4. **Verification**:
   After deployment, verify your contract on Flowdiver using the verification API.

5. **Important Notes**:
   - Mainnet transactions require real FLOW tokens
   - Double-check all addresses and values before deploying
   - Consider using a multisig wallet for production deployments
   - Monitor gas prices as they can fluctuate on Flow network

### Additional Configuration
For Hardhat/Truffle configuration, use these network settings:

```javascript
module.exports = {
  networks: {
    sepolia: {
      url: process.env.SEPOLIA_RPC_URL || "https://rpc.sepolia.org",
      chainId: 11155111,
      accounts: process.env.PRIVATE_KEY ? [process.env.PRIVATE_KEY] : []
    },
    katana: {
      url: "https://api.roninchain.com/rpc",
      chainId: 1261120,
      accounts: process.env.KATANA_PRIVATE_KEY ? [process.env.KATANA_PRIVATE_KEY] : []
    },
    flowTestnet: {
      url: "https://evm.flow-testnet.starknet.io",
      chainId: 356256156,
      accounts: process.env.FLOW_PRIVATE_KEY ? [process.env.FLOW_PRIVATE_KEY] : []
    },
    flowMainnet: {
      url: "https://mainnet.evm.nodes.onflow.org",
      chainId: 747,
      accounts: process.env.FLOW_MAINNET_PRIVATE_KEY ? [process.env.FLOW_MAINNET_PRIVATE_KEY] : []
    }
  }
};
```

## Flow EVM Specific Notes

1. **Environment Setup**:
   ```bash
   # In your .env file
   FLOW_RPC_URL=https://evm.flow-testnet.starknet.io
   ```

2. **Deployment**:
   ```bash
   # Deploy to Flow EVM
   forge script script/DeployFlow.s.sol \
     --rpc-url $FLOW_RPC_URL \
     --broadcast \
     -vvvv
   ```

3. **After Deployment**:
   - Contract address will be saved to `deployments/flow-addresses.json`
   - You can interact with the contract using the standard Web3 tools
   - For verification, check Flow's documentation as the process differs from Ethereum

4. **Troubleshooting**:
   - Ensure you have sufficient FLOW tokens for gas
   - The Flow EVM is still in testnet, so expect occasional network issues
   - Transaction times may be longer than on other networks

## Troubleshooting

- If you encounter nonce issues, try resetting your account nonce
- For gas-related issues, check the current gas prices and adjust accordingly
- Make sure you have sufficient testnet tokens for deployment

## Security Considerations

- Never commit your private keys to version control
- Use environment variables or a secure secret manager
- Consider using a hardware wallet for production deployments
