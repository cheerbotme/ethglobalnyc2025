
const { ethers, NonceManager } = require('ethers');
const path = require('path');
const fs = require('fs');

// Load ABI from the compiled contract
const contractArtifactPath = path.resolve(__dirname, '../../erc7827-contract/out/ERC7827.sol/ERC7827.json');
const { abi: ERC7827_ABI } = JSON.parse(fs.readFileSync(contractArtifactPath, 'utf8'));

/**
 * A library for interacting with ERC7827 smart contracts.
 */
class ERC7827 {
    /**
     * @param {string} contractAddress The address of the ERC7827 contract.
     * @param {ethers.Provider | ethers.Signer} providerOrSigner An ethers.js Provider or Signer.
     */
    constructor(contractAddress, signerOrProvider) {
        if (!contractAddress || !signerOrProvider) {
            throw new Error("Contract address and signer/provider are required.");
        }
        this.contractAddress = contractAddress;
        this.contract = new ethers.Contract(
          contractAddress,
          ERC7827_ABI,
          signerOrProvider
        );

        // Store the signer/provider and wrap with NonceManager if it's a signer
        if (this._isSigner(signerOrProvider)) {
            this.signer = new NonceManager(signerOrProvider);
        } else {
            this.signer = signerOrProvider;
        }
    }

    /**
     * Checks if the given provider is a signer.
     * @param {any} providerOrSigner The provider or signer to check.
     * @returns {boolean} True if the provider is a signer.
     * @private
     */
    _isSigner(providerOrSigner) {
        if (!providerOrSigner) return false;
        // Check for ethers v6 signer
        if (typeof providerOrSigner.getAddress === 'function') return true;
        // Check for ethers v5 signer
        if (providerOrSigner._isSigner) return true;
        // Check for NonceManager
        if (providerOrSigner.signer) return true;
        return false;
    }

    /**
     * Safely parses a JSON string.
     * @param {string} jsonString The JSON string to parse.
     * @returns {object | Array | string} The parsed object or the original string if parsing fails.
     * @private
     */
    _safeJsonParse(jsonString) {
        try {
            return JSON.parse(jsonString);
        } catch (error) {
            return jsonString; // Return raw string if not valid JSON
        }
    }

    /**
     * Fetches the latest state of the JSON object from the contract.
     * @returns {Promise<object|null>} A promise that resolves to the parsed JSON object.
     */
    async getJson() {
        const jsonString = await this.contract.json();
        return this._safeJsonParse(jsonString);
    }

    /**
     * Fetches the version history of a specific key.
     * @param {string} key The key to retrieve the version history for.
     * @returns {Promise<Array|null>} A promise that resolves to an array of historical values.
     */
    async getVersion(key) {
        const versionString = await this.contract.version(key);
        return this._safeJsonParse(versionString);
    }

    /**
     * Gets the total number of keys in the contract.
     * @returns {Promise<number>} A promise that resolves to the total number of keys.
     */
    async getTotalKeys() {
        const totalKeys = await this.contract.totalKeys();
        return Number(totalKeys);
    }

    /**
     * Gets the value of a key at a specific version index.
     * @param {string} key The key to retrieve the value for.
     * @param {number} versionIndex The index of the version to retrieve.
     * @returns {Promise<string>} A promise that resolves to the value at the specified index.
     */
    async getValueAt(key, versionIndex) {
        return this.contract.valueAt(key, versionIndex);
    }

    /**
     * Gets the owner of the contract.
     * @returns {Promise<string>} A promise that resolves to the owner's address.
     */
    async getOwner() {
        return this.contract.owner();
    }

    /**
     * Writes key-value pairs to the contract. (Requires a signer)
     * @param {string[]} keys An array of keys to write.
     * @param {string[]} values An array of values to write.
     * @param {boolean} update Whether to update existing keys.
     * @param {object} [overrides] Additional transaction overrides.
     * @returns {Promise<ethers.TransactionResponse>} A promise that resolves to the transaction response.
     */
    async write(keys, values, update = false, overrides = {}) {
        if (!Array.isArray(keys) || !Array.isArray(values) || keys.length !== values.length) {
            throw new Error("Keys and values must be arrays of the same length");
        }

        if (this._isSigner(this.signer)) {
            // Add a small delay between transactions to avoid nonce issues
            await new Promise(resolve => setTimeout(resolve, 1000));
            
            // Send the transaction using the NonceManager
            const tx = await this.contract.write(keys, values, update, overrides);
            
            // Wait for the transaction to be mined
            await tx.wait();
            
            return tx;
        } else {
            // Read-only call
            return this.contract.callStatic.write(keys, values, update);
        }
    }

    /**
     * Transfers ownership of the contract. (Requires a signer)
     * @param {string} newOwner The address of the new owner.
     * @returns {Promise<ethers.TransactionResponse>} A promise that resolves to the transaction response.
     */
    async transferOwnership(newOwner) {
        if (!this._isSigner()) {
            throw new Error("A signer is required for write operations.");
        }
        const tx = await this.contract.transferOwnership(newOwner);
        return tx;
    }
}

module.exports = ERC7827;
