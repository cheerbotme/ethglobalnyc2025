const flowService = require('./services/flowService');

async function testFlowService() {
  try {
    console.log('Testing Flow EVM service...');
    const result = await flowService.getContractData();
    
    if (result.success) {
      console.log('✅ Successfully fetched contract data:');
      console.log(JSON.stringify(result.data, null, 2));
    } else {
      console.error('❌ Error fetching contract data:');
      console.error(result.error);
      if (result.rawData) {
        console.error('Raw response:', result.rawData);
      }
    }
  } catch (error) {
    console.error('❌ Unhandled error in test:', error);
  }
}

testFlowService();
