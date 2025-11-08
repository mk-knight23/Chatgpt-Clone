// Test script to verify OpenRouter integration
const { openRouterService } = require('./lib/openrouter.ts');
const { getModelById, getDefaultModel } = require('./lib/client-models.ts');

async function testOpenRouterIntegration() {
  console.log('🧪 Testing OpenRouter Integration...');
  
  // Test 1: Check if default model is available
  console.log('\n📋 Test 1: Default Model Check');
  const defaultModel = getDefaultModel();
  console.log(`✅ Default model: ${defaultModel}`);
  
  // Test 2: Check if model info is available
  console.log('\n📋 Test 2: Model Information Check');
  const modelInfo = getModelById(defaultModel);
  if (modelInfo) {
    console.log(`✅ Model found: ${modelInfo.name}`);
    console.log(`   Description: ${modelInfo.description}`);
    console.log(`   Context length: ${modelInfo.context_length}`);
    console.log(`   Is free: ${modelInfo.isFree}`);
  } else {
    console.log('❌ Model not found');
  }
  
  // Test 3: Check environment variables
  console.log('\n📋 Test 3: Environment Variables Check');
  const apiKey = process.env.OPENROUTER_API_KEY;
  if (apiKey) {
    console.log(`✅ OpenRouter API key found: ${apiKey.substring(0, 10)}...`);
  } else {
    console.log('❌ OpenRouter API key not found');
  }
  
  // Test 4: Check if service can be initialized
  console.log('\n📋 Test 4: Service Initialization Check');
  try {
    await openRouterService.initialize();
    const freeModels = openRouterService.getFreeModels();
    console.log(`✅ Service initialized with ${freeModels.length} free models`);
  } catch (error) {
    console.log(`❌ Service initialization failed: ${error.message}`);
  }
  
  console.log('\n🎉 Test completed!');
}

// Run tests
testOpenRouterIntegration().catch(console.error);
