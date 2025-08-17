
import { ethers } from "https://cdnjs.cloudflare.com/ajax/libs/ethers/6.7.0/ethers.min.js";
import ERC7827 from '../src/ERC7827.js';

// --- Configuration ---
// IMPORTANT: Replace with your deployed contract address
const CONTRACT_ADDRESS = "0x5FbDB2315678afecb367f032d93F642f64180aa3"; 

// --- DOM Elements ---
const connectButton = document.getElementById('connectButton');
const walletInfo = document.getElementById('walletInfo');
const walletAddressSpan = document.getElementById('walletAddress');
const contractUi = document.getElementById('contractUi');
const contractAddressSpan = document.getElementById('contractAddress');
const getJsonButton = document.getElementById('getJsonButton');
const getTotalKeysButton = document.getElementById('getTotalKeysButton');
const versionKeyInput = document.getElementById('versionKeyInput');
const getVersionButton = document.getElementById('getVersionButton');
const writeKeyInput = document.getElementById('writeKeyInput');
const writeValueInput = document.getElementById('writeValueInput');
const replaceCheckbox = document.getElementById('replaceCheckbox');
const writeButton = document.getElementById('writeButton');
const resultsDiv = document.getElementById('results');

// --- State ---
let provider;
let signer;
let erc7827;

// --- Functions ---

/**
 * Connects to the user's wallet.
 */
async function connectWallet() {
    if (typeof window.ethereum === 'undefined') {
        alert('Please install MetaMask!');
        return;
    }

    try {
        provider = new ethers.BrowserProvider(window.ethereum);
        signer = await provider.getSigner();
        const address = await signer.getAddress();
        
        walletAddressSpan.textContent = address;
        walletInfo.classList.remove('hidden');
        connectButton.classList.add('hidden');
        contractUi.classList.remove('hidden');

        initializeLibrary();
    } catch (error) {
        console.error("Failed to connect wallet:", error);
        alert('Failed to connect wallet. See console for details.');
    }
}

/**
 * Initializes the ERC7827 library instance.
 */
function initializeLibrary() {
    contractAddressSpan.textContent = CONTRACT_ADDRESS;
    // We use the signer here to allow for both read and write operations.
    erc7827 = new ERC7827(CONTRACT_ADDRESS, signer); 
}

/**
 * Renders results to the UI.
 * @param {string} title The title of the result.
 * @param {any} data The data to display.
 */
function displayResult(title, data) {
    resultsDiv.innerHTML = `<strong>${title}:</strong>\n${JSON.stringify(data, null, 2)}`;
}

/**
 * Handles errors and displays them.
 * @param {Error} error The error object.
 */
function handleError(error) {
    console.error(error);
    resultsDiv.innerHTML = `<strong style="color: red;">Error:</strong>\n${error.message}`;
}

// --- Event Listeners ---

connectButton.addEventListener('click', connectWallet);

getJsonButton.addEventListener('click', async () => {
    try {
        const data = await erc7827.getJson();
        displayResult('Latest JSON State', data);
    } catch (error) {
        handleError(error);
    }
});

getTotalKeysButton.addEventListener('click', async () => {
    try {
        const count = await erc7827.getTotalKeys();
        displayResult('Total Keys', count);
    } catch (error) {
        handleError(error);
    }
});

getVersionButton.addEventListener('click', async () => {
    const key = versionKeyInput.value;
    if (!key) {
        alert('Please enter a key for the version history.');
        return;
    }
    try {
        const history = await erc7827.getVersion(key);
        displayResult(`Version History for "${key}"`, history);
    } catch (error) {
        handleError(error);
    }
});

writeButton.addEventListener('click', async () => {
    const key = writeKeyInput.value;
    const value = writeValueInput.value;
    const replace = replaceCheckbox.checked;

    if (!key || !value) {
        alert('Please enter both a key and a value.');
        return;
    }

    try {
        resultsDiv.textContent = 'Sending transaction...';
        const tx = await erc7827.write([key], [value], replace);
        displayResult('Transaction Sent', { hash: tx.hash });
        
        await tx.wait();
        displayResult('Transaction Confirmed', { hash: tx.hash });
        
        // Refresh JSON view
        getJsonButton.click();

    } catch (error) {
        handleError(error);
    }
});
