const axios = require('axios');
const OPENAI_URL = 'https://api.openai.com/v1/embeddings';
//model: 'text-embedding-ada-002'
async function getEmbedding(text) {
  const response = await axios.post(
    OPENAI_URL,
    {
      input: text,
      model: 'text-embedding-3-small',
      dimensions:1536,
      encoding_format: 'float'
    },
    {
      headers: {
        Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
      }
    }
  );
  return response.data.data[0].embedding;
}

module.exports = { getEmbedding };