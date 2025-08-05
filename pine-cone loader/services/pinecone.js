const { Pinecone } = require('@pinecone-database/pinecone');
const { getEmbedding } = require('./openai');
const logger = require('../utils/logger');

const pinecone = new Pinecone({
  apiKey: process.env.PINECONE_API_KEY,
  
});
//environment: process.env.PINECONE_ENVIRONMENT
const indexName = process.env.PINECONE_INDEX;
const namespaceName = process.env.PINECONE_NAMESPACE || 'IVF2';
const index = pinecone.index(indexName);
const namespace = index.namespace(namespaceName);

// async function initIndex() {
//   const existingIndexes = await pinecone.listIndexes();
//   if (!existingIndexes.includes(indexName)) {
//     await pinecone.createIndex({
//       name: indexName,
//       dimension: 1536,
//       metric: 'cosine'
//     });
//     logger.info(`Created Pinecone index: ${indexName}`);
//   }
//   return pinecone.Index(indexName);
// }

async function upsertBatch(batch, index, retry = 0) {
  try {
    //console.log(indexName,29);
    
    //const index = pinecone.index(indexName);
    //const namespace = index.namespace(process.env.PINECONE_NAMESPACE || "__default__");
    //const namespace = pinecone.index(indexName, "https://test2-rzf5jfp.svc.aped-4627-b74a.pinecone.io")//.namespace("example-namespace");
    const vectors = await Promise.all(batch.map(async item => ({
      id: item.id,
      values: await getEmbedding(item.text),
      metadata: {text:item.text} || {}
    })));
console.log(typeof(vectors),39);
//await namespace.upsertRecords(vectors);
   // await index.upsert( vectors);
   if (vectors.length > 0) {
    logger.debug(`Vector type: ${typeof vectors}, first vector:`, vectors[0]);
  }

  // Upsert to namespace if using namespaces, otherwise to index
  if (namespaceName !== 'default') {
    await namespace.upsert(vectors);
  } else {
    await index.upsert(vectors);
  }

    logger.info(`Batch ${retry === 0 ? 'upserted' : 'retried'} successfully: ${batch.length} items`);

  } catch (error) {
    logger.error(`Batch failed (retry ${retry})`, { ids: batch.map(x => x.id) });
    if (retry < 2) {
      const delay = 1000 * Math.pow(2, retry); // 1s, 2s
      await new Promise(res => setTimeout(res, delay));
      await upsertBatch(batch, index, retry + 1);
    } else {
      throw error;
    }
  }
}

async function processBatches(items) {
  //const index = await initIndex();
  const batchSize = 100;
  for (let i = 0; i < items.length; i += batchSize) {
    const batch = items.slice(i, i + batchSize);
    logger.info(`Processing batch ${i / batchSize}`);
    await upsertBatch(batch, index);
  }
}

module.exports = { processBatches };