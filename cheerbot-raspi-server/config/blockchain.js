// Blockchain Configuration
module.exports = {
  // Flow Mainnet EVM
  flow: {
    rpcUrl: 'https://mainnet.evm.nodes.onflow.org',
    contractAddress: '0x04B386e36F89E5bB568295779089E91ded070057',
    chainId: 747, // Flow Mainnet EVM Chain ID (matches DeployFlowMainnet.s.sol)
    network: 'flow-mainnet-evm',
    // Add any Flow EVM-specific configurations here
  },
  
  // Katana Tatara Testnet
  katana: {
    rpcUrl: 'https://rpc.tatara.katanarpc.com',
    contractAddress: '0x77331C208e7a6d4C05b0A0f87dB2Df9f154321a8',
    chainId: 129399, // Katana Tatara Testnet Chain ID
    network: 'katana-tatara-testnet',
    // Add any Katana-specific configurations here
  }
};
