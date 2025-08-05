const axios = require('axios');
const logger = require('../utils/logger');

async function getEmbedding(text) {
  const res = await axios.post('https://api.openai.com/v1/embeddings', {
    input: text,
    model: 'text-embedding-3-small',
    dimensions:1536,
  }, {
    headers: {
      Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
    }
  });
  return res.data.data[0].embedding;
}

async function generateReply(prompt) {
  try {    
    const res = await axios.post('https://api.openai.com/v1/chat/completions', {
      model: 'gpt-3.5-turbo',
      messages: [{ role: 'user', content: prompt }]
    }, {
      headers: {
        Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
      }
    });
    const reply = res.data.choices?.[0]?.message?.content;
    logger.info(`OpenAI reply: ${reply}`);
    return reply;
  } catch (err) {
    logger.error('OpenAI generation failed', err);
    return null;
  }
}

module.exports = { getEmbedding, generateReply };