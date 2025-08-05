const { Pinecone } = require('@pinecone-database/pinecone');

// Load environment variables if using .env
require('dotenv').config();

async function testPinecone() {
  try {
    const pinecone = new Pinecone({
      apiKey: process.env.PINECONE_API_KEY,
    });

    // Use your actual index name and host from your environment/config
    const index = pinecone.Index(
      process.env.PINECONE_INDEX,
      process.env.PINECONE_HOST
    );

    // Use a dummy vector of the correct dimension (e.g., 1536 for OpenAI embeddings)
    const dummyVector = Array(1536).fill(0.01);

    const result = await index.query({
      vector: dummyVector,
      topK: 1,
      includeMetadata: false,
    });

    console.log('Pinecone query result:', result);
  } catch (err) {
    console.error('Pinecone test failed:', err);
  }
}

testPinecone();