require('dotenv').config();
const fs = require('fs');
const { processBatches } = require('./services/pinecone');

const file = process.argv[2];
const namespace = process.argv[3]?.split('=')[1] || 'default';
process.env.PINECONE_NAMESPACE = namespace;

if (!file) {
  console.error('Usage: node ingest.js input.json --namespace=myNamespace');
  process.exit(1);
}

const data = JSON.parse(fs.readFileSync(file, 'utf8'));
processBatches(data).then(() => {
  console.log('Ingestion complete');
}).catch(err => {
  console.error('Failed:', err.message);
});