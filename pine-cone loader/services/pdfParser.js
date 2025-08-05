const fs = require('fs');
const pdfParse = require('pdf-parse');

async function extractItemsFromPDF(filePath) {
  const dataBuffer = fs.readFileSync(filePath);
  const pdfData = await pdfParse(dataBuffer);
  const text = pdfData.text;

  const chunks = chunkText(text, 500); // 500 character chunks
  return chunks.map((chunk, i) => ({
    id: `pdf_chunk_${i}`,
    text: chunk,
    metadata: { source: 'pdf', chunk: i + 1 }
  }));
}

function chunkText(text, chunkSize = 500) {
  const result = [];
  for (let i = 0; i < text.length; i += chunkSize) {
    result.push(text.slice(i, i + chunkSize));
  }
  return result;
}

module.exports = { extractItemsFromPDF };