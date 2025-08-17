#!/usr/bin/env node
const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const path = require('path');
const flowService = require('./services/flowService');
const katanaService = require('./services/katanaService');

// Initialize Express app
const app = express();
const server = http.createServer(app);
const io = socketIo(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"]
  }
});

// Middleware
app.use(express.static(__dirname));
app.use(express.json());

// Routes
app.get('/api/blockchain-data', async (req, res) => {
  try {
    const [flowData, katanaData] = await Promise.all([
      flowService.getContractData(),
      katanaService.getContractData()
    ]);
    
    res.json({
      flow: flowData,
      katana: katanaData,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('Error fetching blockchain data:', error);
    res.status(500).json({ error: 'Failed to fetch blockchain data' });
  }
});

// Serve index.html for the root route
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

// Socket.io connection
io.on('connection', (socket) => {
  console.log('Client connected');
  
  // Send initial blockchain data
  updateBlockchainData(socket);
  
  // Set up polling for updates (every 30 seconds)
  const interval = setInterval(() => updateBlockchainData(socket), 30000);
  
  socket.on('disconnect', () => {
    console.log('Client disconnected');
    clearInterval(interval);
  });
});

async function updateBlockchainData(socket) {
  try {
    const [flowData, katanaData] = await Promise.all([
      flowService.getContractData(),
      katanaService.getContractData()
    ]);
    
    socket.emit('blockchain-update', {
      flow: flowData,
      katana: katanaData,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('Error updating blockchain data:', error);
  }
}

// Start server
const PORT = process.env.PORT || 3000;
server.listen(PORT, '0.0.0.0', () => {
  console.log(`Server running on port ${PORT}`);
  console.log(`Visit http://localhost:${PORT} in your browser`);
});
