require('dotenv').config();
const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const path = require('path');
const { getSemanticResponse } = require('./socket');
const logger = require('./utils/logger');

const app = express();
const server = http.createServer(app);
const io = socketIo(server);

app.use(express.static(path.join(__dirname, 'public')));

io.on('connection', socket => {
  logger.info('User connected');
  socket.on('userMessage', async (msg) => {
    logger.info(`Received message: ${msg}`);
    const response = await getSemanticResponse(msg);
    socket.emit('botResponse', response);
  });
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => logger.info(`Server listening on port ${PORT}`));