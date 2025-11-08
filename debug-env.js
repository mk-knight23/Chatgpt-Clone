require('dotenv').config();

console.log('Environment variables:');
console.log('OPENROUTER_API_KEY:', process.env.OPENROUTER_API_KEY);
console.log('Length:', process.env.OPENROUTER_API_KEY?.length || 0);
console.log('Starts with sk-or-v1:', process.env.OPENROUTER_API_KEY?.startsWith('sk-or-v1-'));
