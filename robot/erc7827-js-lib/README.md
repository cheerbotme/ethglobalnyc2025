# ERC7827.js Library

A simple, modular JavaScript library for interacting with ERC7827-compliant smart contracts, built with ethers.js.

## Features

-   **Modular Design**: Easily import and use with any ERC7827 contract.
-   **Full Functionality**: Wraps all core ERC7827 functions (`json`, `version`, `write`, etc.).
-   **Owner-Specific Functions**: Includes methods for `Ownable` functions like `transferOwnership`.
-   **Automatic JSON Parsing**: Methods that return JSON strings are automatically parsed into JavaScript objects.
-   **Signer and Provider Support**: Works with a read-only provider or a signer for transactions.

---

## How to Use

### 1. Include the Library

You can use the library by importing the `ERC7827.js` module. The library depends on `ethers.js`, which should be included in your project.

```html
<!-- In your HTML file -->
<script src="https://cdnjs.cloudflare.com/ajax/libs/ethers/6.7.0/ethers.min.js"></script>
<script type="module" src="path/to/your/app.js"></script>
```

```javascript
// In your app.js
import ERC7827 from 'path/to/erc7827-js-lib/src/ERC7827.js';
```

### 2. Initialize the Library

Create a new instance of the `ERC7827` class, providing the contract address and an ethers.js `Provider` or `Signer`.

```javascript
import { ethers } from "ethers";
import ERC7827 from './ERC7827.js';

const contractAddress = "0xYourContractAddress";

// For read-only operations
const provider = new ethers.JsonRpcProvider("YOUR_RPC_URL");
const erc7827Reader = new ERC7827(contractAddress, provider);

// For write operations (requires wallet connection)
const browserProvider = new ethers.BrowserProvider(window.ethereum);
const signer = await browserProvider.getSigner();
const erc7827Writer = new ERC7827(contractAddress, signer);
```

### 3. Call Contract Methods

All contract methods are available as async functions.

```javascript
// Read the latest JSON state
const jsonData = await erc7827Reader.getJson();
console.log(jsonData);

// Get the version history of a key
const history = await erc7827Reader.getVersion("myKey");
console.log(history);

// Write a new key-value pair (requires a signer)
try {
    const tx = await erc7827Writer.write(["myKey"], ["myValue"], false);
    console.log("Transaction sent:", tx.hash);
    await tx.wait();
    console.log("Transaction confirmed!");
} catch (error) {
    console.error("Transaction failed:", error);
}
```

---

## Running the Example

The included example provides a simple web interface to demonstrate the library's functionality.

### Prerequisites

1.  **Foundry & Anvil**: You need to have Foundry installed to run a local test node.
2.  **MetaMask**: A browser with the MetaMask extension is required to interact with the example.

### Steps

1.  **Start a Local Node**:
    Open a terminal in the `robot/erc7827-contract` directory and run:
    ```bash
    anvil
    ```
    This will start a local blockchain. Copy the address of the deployed `ERC7827` contract from the output (it's usually the first one).

2.  **Update the Contract Address**:
    Open `robot/erc7827-js-lib/examples/app.js` and replace the placeholder `CONTRACT_ADDRESS` with the address you copied from Anvil.

3.  **Serve the Example**:
    You need a simple HTTP server to serve the `examples` directory. If you have Python, you can run this command from inside the `robot/erc7827-js-lib/examples` directory:
    ```bash
    python -m http.server
    ```
    If you have Node.js, you can use `npx`:
    ```bash
    npx serve
    ```

4.  **Open in Browser**:
    Open your web browser and navigate to `http://localhost:8000` (or the address provided by your server). Connect your MetaMask wallet (configured for the local Anvil network) and interact with the contract.
