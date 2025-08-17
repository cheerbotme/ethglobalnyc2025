const { ethers } = require('ethers');
const config = require('../config/blockchain').flow;
const axios = require('axios');

// Initialize provider
const provider = new ethers.JsonRpcProvider(config.rpcUrl);

// Minimal ABI with just the json() function
const CONTRACT_ABI = [
  'function json() view returns (string)'
];

// Ensure contract address is checksummed
const contractAddress = ethers.getAddress(config.contractAddress);
console.log('Initializing Flow EVM contract at:', contractAddress);

// Contract instance
const contract = new ethers.Contract(
  contractAddress,
  CONTRACT_ABI,
  provider
);

// Helper function to safely parse JSON and handle BigInt
const safeJsonParse = (jsonString) => {
  try {
    if (!jsonString) return {};
    
    // Handle BigInt serialization
    const reviver = (key, value) => {
      if (typeof value === 'bigint') {
        return value.toString();
      }
      return value;
    };
    
    return JSON.parse(jsonString, reviver);
  } catch (e) {
    console.error('Error parsing JSON from Flow contract:', e);
    return { 
      error: 'Failed to parse JSON data', 
      raw: String(jsonString).substring(0, 200) 
    };
  }
};

/**
 * Get JSON data from the ERC7827 contract on Flow EVM
 * @returns {Promise<Object>} - Parsed JSON data from the contract
 */
const getContractData = async () => {
  try {
    console.log('Fetching Flow EVM contract data from:', contractAddress);
    
    // Call the contract's json() function
    const jsonString = await contract.json();
    
    // Parse the JSON string from the contract
    const parsedData = safeJsonParse(jsonString);
    
    if (parsedData.error) {
      console.error('Error parsing contract data:', parsedData);
      return {
        success: false,
        error: parsedData.error,
        rawData: parsedData.raw
      };
    }
    
    return {
      success: true,
      data: parsedData,
      timestamp: new Date().toISOString()
    };
  } catch (e) {
    console.error('Error in getContractData:', {
      message: e.message,
      code: e.response?.status,
      stack: e.stack,
      url: e.config?.url
    });
    
    return {
      success: false,
      error: e.message || 'Failed to fetch contract data',
      _metadata: {
        contractAddress: config.contractAddress,
        network: 'flow-evm',
        timestamp: new Date().toISOString()
      }
    };
  }
};

module.exports = {
  getContractData
};
