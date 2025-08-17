const { ethers } = require('ethers');
const { execSync, spawn } = require('child_process');
const path = require('path');
const fs = require('fs');
const ERC7827 = require('../src/ERC7827');

// Helper function to wait for a transaction to be mined
async function waitForTx(provider, txHash) {
  console.log(`⏳ Waiting for transaction ${txHash} to be mined...`);
  return provider.waitForTransaction(txHash);
}

// Configuration
const ANVIL_PORT = 8545;
const ANVIL_MNEMONIC = 'test test test test test test test test test test test junk';
const ANVIL_DEFAULT_BALANCE = '1000000';

// Start anvil in a separate process
console.log('🚀 Starting Anvil...');
const anvil = spawn('anvil', [
  '--port', ANVIL_PORT.toString(),
  '--mnemonic', ANVIL_MNEMONIC,
  '--balance', ANVIL_DEFAULT_BALANCE,
  '--silent'
]);

// Handle anvil output
anvil.stdout.on('data', (data) => {
  console.log(`[anvil] ${data}`.trim());
});

anvil.stderr.on('data', (data) => {
  console.error(`[anvil error] ${data}`.trim());
});

// Ensure anvil is killed when the script exits
process.on('exit', () => {
  if (!anvil.killed) {
    anvil.kill();
  }
});

// Handle Ctrl+C
process.on('SIGINT', () => {
  console.log('\nShutting down...');
  process.exit(0);
});

async function startAnvil() {
  console.log('🚀 Starting Anvil...');
  const anvil = spawn('anvil', [
    '--port', ANVIL_PORT.toString(),
    '--mnemonic', ANVIL_MNEMONIC,
    '--balance', ANVIL_DEFAULT_BALANCE,
    '--code-size-limit', '50000'
  ]);

  anvil.stdout.on('data', (data) => {
    console.log(data.toString().trim());
  });

  anvil.stderr.on('data', (data) => {
    console.error(`Anvil error: ${data}`);
  });

  anvil.on('close', (code) => {
    console.log(`Anvil process exited with code ${code}`);
  });

  // Wait for Anvil to start
  await new Promise(resolve => setTimeout(resolve, 2000));
  
  return anvil;
}

async function deployContract() {
  console.log('\n🔑 Connecting to Anvil...');
  const provider = new ethers.JsonRpcProvider(`http://127.0.0.1:${ANVIL_PORT}`);
  
  // Use the first account from the mnemonic
  const wallet = ethers.Wallet.fromPhrase(ANVIL_MNEMONIC, provider);
  console.log(`Using account: ${wallet.address}`);

  // Compile the contract
  console.log('\n🔧 Compiling contract...');
  const contractPath = path.join(__dirname, '../../erc7827-contract');
  execSync('forge build', { cwd: contractPath, stdio: 'inherit' });
  
  // Get contract ABI and bytecode
  const bytecodePath = path.join(contractPath, 'out/ERC7827.sol/ERC7827.json');
  const { abi, bytecode } = JSON.parse(fs.readFileSync(bytecodePath, 'utf8'));
  
  // Deploy the contract
  console.log('🚀 Deploying contract...');
  const factory = new ethers.ContractFactory(abi, bytecode, wallet);
  const contract = await factory.deploy();
  await contract.waitForDeployment();
  
  const contractAddress = await contract.getAddress();
  console.log(`✅ Contract deployed at: ${contractAddress}`);
  
  return { provider, wallet, contractAddress, abi };
}

async function testContract(provider, wallet, contractAddress) {
  console.log('\n🧪 Testing contract functionality...');
  
  // Create a proper signer with the provider and wrap it with NonceManager
  const signer = new ethers.Wallet(wallet.privateKey, provider);
  
  // Create ERC7827 instance with the signer
  console.log('Creating ERC7827 instance...');
  const erc7827 = new ERC7827(contractAddress, signer);
  
  // Add a small delay to ensure everything is initialized
  await new Promise(resolve => setTimeout(resolve, 1000));
  
  // Test 1: Check initial state
  console.log('\n📋 Initial state:');
  console.log('- Owner:', await erc7827.getOwner());
  console.log('- Total keys:', await erc7827.getTotalKeys());
  console.log('- JSON:', await erc7827.getJson());
  
  // Test 2: Write data
  console.log('\n✍️  Writing initial test data...');
  try {
    const tx1 = await erc7827.write(
      ["testKey1", "testKey2"],
      ["testValue1", "testValue2"]
    );
    console.log('- First write transaction hash:', tx1.hash);
    const receipt1 = await tx1.wait();
    console.log('- First write confirmed in block:', receipt1.blockNumber);
    
    // Add a small delay between writes
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    // Test 3: Update data
    console.log('\n🔄 Updating test data...');
    const tx2 = await erc7827.write(
      ["testKey1", "testKey2"],
      ["updatedValue1", "updatedValue2"],
      true // Update existing keys
    );
    console.log('- Update transaction hash:', tx2.hash);
    const receipt2 = await tx2.wait();
    console.log('- Update confirmed in block:', receipt2.blockNumber);
    
  } catch (error) {
    console.error('Error during write operations:', error);
    throw error;
  }
  
  // Test 3: Read data
  console.log('\n📖 Reading data...');
  console.log('- Total keys:', await erc7827.getTotalKeys());
  console.log('- JSON:', await erc7827.getJson());
  
  // Test 4: Check version history
  console.log('\n🕰️  Version history for "name":');
  console.log(await erc7827.getVersion('name'));
  
  // Test 5: Update a value
  console.log('\n🔄 Updating "name"...');
  const tx2 = await erc7827.write(
    ['name'],
    ['ERC7827-Updated'],
    true
  );
  await tx2.wait();
  
  // Test 6: Check updated data
  console.log('\n📝 Updated data:');
  console.log('- JSON:', await erc7827.getJson());
  console.log('- Version history for "name":', await erc7827.getVersion('name'));
  
  return erc7827;
}

async function main() {
  let anvil;
  
  try {
    // Start fresh Anvil instance
    anvil = await startAnvil();
    
    // Deploy contract
    const { provider, wallet, contractAddress } = await deployContract();
    
    // Test the contract
    await testContract(provider, wallet, contractAddress);
    
    console.log('\n🎉 Demo completed successfully!');
    
  } catch (error) {
    console.error('\n❌ Error:', error);
  } finally {
    // Clean up
    if (anvil) {
      anvil.kill();
    }
    process.exit(0);
  }
}

// Wait for anvil to start, then run the demo
setTimeout(async () => {
  try {
    await main();
  } catch (error) {
    console.error('Unhandled error in main:', error);
    process.exit(1);
  }
}, 2000);
