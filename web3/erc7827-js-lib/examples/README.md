# ERC7827 Example

This example demonstrates how to use the ERC7827 JavaScript library to interact with an ERC7827 smart contract using Anvil as a local development blockchain.

## Prerequisites

- Node.js (v16 or later)
- Foundry (for Anvil and Forge)
- Yarn or npm

## Installation

1. Install dependencies:
   ```bash
   cd erc7827-js-lib
   yarn install  # or npm install
   ```

2. Install Foundry (if not already installed):
   ```bash
   curl -L https://foundry.paradigm.xyz | bash
   foundryup
   ```

## Running the Example

1. Start the demo script:
   ```bash
   cd examples
   node demo.js
   ```

## What the Example Does

The demo script will:

1. Start a local Anvil instance
2. Deploy the ERC7827 contract
3. Demonstrate various operations:
   - Checking the initial contract state
   - Writing key-value pairs
   - Reading data back
   - Viewing version history
   - Updating values

## Example Output

```
🚀 Starting Anvil...
🔑 Using account: 0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266

🛠️  Compiling and deploying ERC7827 contract...
🔧 Compiling contract...
🚀 Deploying contract...
✅ Contract deployed at: 0x5FbDB2315678afecb367f032d93F642f64180aa3

🔌 Initializing ERC7827 library...

🧪 Testing contract functionality...

📋 Initial state:
- Owner: 0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266
- Total keys: 0
- JSON: {}

✍️  Writing data...
✅ Data written successfully!

📖 Reading data...
- Total keys: 3
- JSON: {"name":"ERC7827","version":"1.0.0","description":"A versioned JSON storage contract"}

🕰️  Version history for "name":
['ERC7827']

🔄 Updating "name"...

📝 Updated data:
- JSON: {"name":"ERC7827-Updated","version":"1.0.0","description":"A versioned JSON storage contract"}
- Version history for "name": ['ERC7827', 'ERC7827-Updated']

🎉 Demo completed successfully!
Press Ctrl+C to exit
```

## Cleanup

Press `Ctrl+C` to stop the script and the Anvil instance.
