const { searchVectors } = require('./services/pinecone');
const { generateReply } = require('./services/openai');
const logger = require('./utils/logger');

async function getSemanticResponse(query) {
  try {
    const contextResults = await searchVectors(query);
    logger.info(`Pinecone results: ${contextResults.length}`);
//console.log(contextResults,10);

   const contextText = contextResults.map(r => r.metadata?.text || '').join('\n');

  
    const finalPrompt = `You are a kind and generous chatbot.\nContext:\n${contextText}\nUser: ${query}`;


    const reply = await generateReply(finalPrompt);
    return reply || fallbackMessage();
    //return "bye";
  } catch (err) {
    logger.error('Error in semantic response:', err);
    return fallbackMessage();
  }
}

function fallbackMessage() {
  return "I'm really sorry, I couldn’t find the perfect answer right now — but I'm here if you'd like to try again!";
}

module.exports = { getSemanticResponse };