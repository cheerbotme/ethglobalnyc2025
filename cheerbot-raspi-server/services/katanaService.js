const { ethers } = require('ethers');
const config = require('../config/blockchain').katana;
const axios = require('axios');

// Initialize provider
const provider = new ethers.JsonRpcProvider(config.rpcUrl);

// Minimal ABI with just the json() function
const CONTRACT_ABI = [
  'function json() view returns (string)'
];

// Ensure contract address is checksummed
const contractAddress = ethers.getAddress(config.contractAddress);
console.log('Initializing Katana contract at:', contractAddress);

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
    console.error('Error parsing JSON:', e);
    return { 
      error: 'Failed to parse JSON', 
      details: e.message,
      rawData: String(jsonString).substring(0, 200) // Show first 200 chars of raw data
    };
  }
};

/**
 * Get JSON data from the ERC7827 contract on Katana
 * @returns {Promise<Object>} - Parsed JSON data from the contract
 */
const getContractData = async () => {
  try {
    console.log('Fetching JSON data from Katana contract at:', contractAddress);
    
    // Verify network connection
    const network = await provider.getNetwork();
    console.log('Connected to network:', {
      name: network.name,
      chainId: network.chainId.toString()
    });

    // Log provider info
    console.log('Provider URL:', config.rpcUrl);
    
    // Make a direct RPC call to check the contract code
    try {
      const code = await provider.getCode(contractAddress);
      console.log('Contract code length:', code.length);
      if (code === '0x') {
        throw new Error('No code at contract address');
      }
    } catch (codeError) {
      console.error('Error checking contract code:', codeError);
      throw new Error(`Contract not found at ${contractAddress}: ${codeError.message}`);
    }

    // Try calling the json function
    console.log('Calling contract.json()...');
    let jsonResult;
    try {
      // First try with ethers
      jsonResult = await contract.json();
      console.log('Raw JSON result from ethers:', {
        type: typeof jsonResult,
        value: jsonResult
      });
    } catch (ethersError) {
      console.error('Error calling json() with ethers:', ethersError);
      
      // Fallback to direct RPC call
      console.log('Trying direct RPC call...');
      try {
        const response = await axios.post(config.rpcUrl, {
          jsonrpc: '2.0',
          method: 'eth_call',
          params: [{
            to: contractAddress,
            data: '0x9d118770' // keccak256('json()').substring(0, 10)
          }, 'latest'],
          id: 1
        });
        
        console.log('RPC response:', response.data);
        
        if (response.data.error) {
          throw new Error(`RPC error: ${JSON.stringify(response.data.error)}`);
        }
        
        jsonResult = response.data.result;
      } catch (rpcError) {
        console.error('RPC call failed:', rpcError);
        throw new Error(`Both ethers and direct RPC calls failed: ${rpcError.message}`);
      }
    }
    
    // Parse the JSON data if it's a string, otherwise use as is
    const jsonData = typeof jsonResult === 'string' 
      ? safeJsonParse(jsonResult)
      : jsonResult;
    
    if (!jsonResult || (typeof jsonResult === 'object' && Object.keys(jsonResult).length === 0)) {
      throw new Error('Contract returned empty response. The contract may not be properly initialized.');
    }
    
    // Create response with metadata
    const response = {
      data: jsonData,
      _metadata: {
        contractAddress,
        network: String(network.name),
        chainId: String(network.chainId),
        timestamp: new Date().toISOString()
      }
    };
    
    return response;

  } catch (error) {
    const errorInfo = {
      message: error.message,
      code: error.code,
      method: error.method,
      contractAddress,
      timestamp: new Date().toISOString()
    };
    
    console.error('Error in getContractData:', {
      ...errorInfo,
      stack: error.stack
    });
    
    // Return a clean error response with stringified values
    return Object.fromEntries(
      Object.entries(errorInfo).map(([k, v]) => [k, String(v)])
    );
  }
};

module.exports = {
  getContractData
};
