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

### Sepolia

After deployment, verify your contract on Etherscan:

```bash
forge verify-contract \
    --chain-id 11155111 \
    --num-of-optimizations 200 \
    --watch \
    --constructor-args $(cast abi-encode "constructor()" "") \
    --compiler-version v0.8.20+commit.a1b79de6 \
    --etherscan-api-key $ETHERSCAN_API_KEY \
    <DEPLOYED_ADDRESS> \
    src/ERC7827.sol:ERC7827
```

## Network Information

### Ethereum Sepolia Testnet
- **Chain ID**: 11155111
- **RPC URL**: 
  - Infura: `https://sepolia.infura.io/v3/YOUR-PROJECT-ID`
  - Alchemy: `https://eth-sepolia.g.alchemy.com/v2/YOUR-API-KEY`
  - Public: `https://rpc.sepolia.org`
- **Explorer**: [Etherscan](https://sepolia.etherscan.io)
- **Faucet**: [Alchemy](https://sepoliafaucet.com/), [QuickNode](https://faucet.quicknode.com/ethereum/sepolia)
- **Wrapped ETH**: 0x7b79995e5f793A07Bc00c21412e50Ecae098E7f9
- **Chain Name**: Sepolia
- **Currency Symbol**: ETH
- **Block Time**: ~12 seconds

### Katana (Ronin) Testnet (Saigon)
- **Chain ID**: 2021
- **RPC URL**: `https://saigon-testnet.roninchain.com/rpc`
- **Explorer**: [Saigon Explorer](https://saigon-app.roninchain.com/)
- **Faucet**: [Ronin Faucet](https://faucet.roninchain.com/)
- **Wrapped RON**: 0xc99a6a985ed2cac1ef41640596c5a5f9f4e19ef5
- **Chain Name**: Ronin Saigon Testnet
- **Currency Symbol**: tRON
- **Block Time**: ~3 seconds

### Katana (Ronin) Mainnet
- **Chain ID**: 2020
- **RPC URL**: `https://api.roninchain.com/rpc`
- **Explorer**: [Ronin Explorer](https://app.roninchain.com/)
- **Documentation**: [Ronin Docs](https://docs.roninchain.com/)
- **Chain Name**: Ronin Mainnet
- **Currency Symbol**: RON
- **Block Time**: ~3 seconds
- **Wrapped RON**: 0xc99a6a985ed2cac1ef41640596c5a5f9f4e19ef5

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
