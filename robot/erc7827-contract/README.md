# ERC7827 Contract

A minimal, gas-efficient contract for storing and versioning JSON data on-chain.

## 🚀 Quick Start

### Prerequisites
- [Foundry](https://book.getfoundry.sh/getting-started/installation)
- [Node.js](https://nodejs.org/) (v16+ recommended)
- Testnet ETH for gas fees

### Setup

1. **Install dependencies**
   ```bash
   forge install
   ```

2. **Set up environment variables**
   ```bash
   cp .env.example .env
   # Edit .env with your private key and RPC URLs
   ```

## 🔧 Deployment

### Local Development

```bash
# Start local node
anvil

# In a new terminal, deploy to local node
forge script script/Deploy.s.sol --rpc-url http://127.0.0.1:8545 --broadcast -vvv
```

### Sepolia Testnet

1. Get Sepolia ETH from a faucet
2. Deploy:
   ```bash
   forge script script/Deploy.s.sol \
     --rpc-url $SEPOLIA_RPC_URL \
     --broadcast \
     --verify \
     -vvvv \
     --etherscan-api-key $ETHERSCAN_API_KEY
   ```

### Deploy to Sepolia

1. Set your environment variables:
   ```bash
   export SEPOLIA_RPC_URL="your-sepolia-rpc-url"
   export PRIVATE_KEY="your-private-key"
   export ETHERSCAN_API_KEY="your-etherscan-api-key" # Optional, for verification
   ```

2. Deploy the contract:
   ```bash
   # Deploy to Sepolia
   forge script script/Deploy.s.sol:Deploy --rpc-url $SEPOLIA_RPC_URL --broadcast --verify -vvvv
   ```

### Deploy to Katana (Ronin Testnet)

1. Set your environment variables:
   ```bash
   export KATANA_RPC="https://saigon-testnet.roninchain.com/rpc"
   export KATANA_PRIVATE_KEY="your-private-key"
   ```

2. Deploy the contract:
   ```bash
   # Deploy to Katana Testnet (Saigon)
   forge script script/DeployKatana.s.sol:DeployKatana --rpc-url $KATANA_RPC --broadcast -vvvv
   ```

### Deploy to Katana Mainnet (Ronin)

1. Set your environment variables:
   ```bash
   export KATANA_MAINNET_RPC="https://api.roninchain.com/rpc"
   export KATANA_MAINNET_PRIVATE_KEY="your-private-key"
   ```

2. Deploy the contract:
   ```bash
   # Deploy to Katana Mainnet
   forge script script/DeployKatanaMainnet.s.sol:DeployKatanaMainnet --rpc-url $KATANA_MAINNET_RPC --broadcast -vvvv
   ```

### Deploy to Flow Testnet

1. Set your environment variables:
   ```bash
   export FLOW_TESTNET_RPC="https://testnet.evm.nodes.onflow.org"
   export FLOW_TESTNET_PRIVATE_KEY="your-private-key"
   ```

2. Deploy the contract:
   ```bash
   # Deploy to Flow Testnet
   forge script script/DeployFlow.s.sol:DeployFlow --rpc-url $FLOW_TESTNET_RPC --broadcast -vvvv
   ```

### Deploy to Flow Mainnet

1. Set your environment variables:
   ```bash
   export FLOW_MAINNET_RPC="https://mainnet.evm.nodes.onflow.org"
   export FLOW_MAINNET_PRIVATE_KEY="your-private-key"
   ```

2. Deploy the contract:
   ```bash
   # Deploy to Flow Mainnet
   forge script script/DeployFlowMainnet.s.sol:DeployFlowMainnet --rpc-url $FLOW_MAINNET_RPC --broadcast -vvvv
   ```

### Forked Network Deployment (Local Testing)

You can also test deployments on a forked network before deploying to mainnet:

```bash
# Start a local fork of Flow Mainnet
anvil --fork-url $FLOW_MAINNET_RPC

# In a separate terminal, deploy to the forked network
forge script script/DeployFlowFork.s.sol:DeployFlowFork --rpc-url http://localhost:8545 --broadcast -vvvv
```

3. The deployment will save the contract address to `deployments/flow-addresses.json`

## 📚 Documentation

- [Contract Documentation](./docs/README.md)
- [Deployment Guide](./DEPLOYMENT.md)
- [Foundry Book](https://book.getfoundry.sh/)

## 🧪 Testing

Run tests:
```bash
forge test -vvv
```

Generate gas report:
```bash
forge test --gas-report
```

## 🔄 Verification

Verify on Etherscan:
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

## 📝 License

MIT
