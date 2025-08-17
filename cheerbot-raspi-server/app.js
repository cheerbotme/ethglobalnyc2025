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
const io = socketIo(server);

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

// HTTP server for handling requests
const httpServer = http.createServer((req, res) => {
  // Handle legacy chat requests
  if (req.url === '/ETHGlobal' && req.method === 'POST') {
    let body = '';
    req.on('data', chunk => {
      body += chunk.toString();
    });
    req.on('end', () => {
      try {
        const message = JSON.parse(body);
        if (message && message.message) {
          // Create message object
          const msgObj = {
            message: message.message,
            sender: message.messenger || 'User',
            timestamp: new Date().toISOString()
          };
          
          // Add to session messages
          sessionMessages.push(msgObj);
          
          // Broadcast to all connected clients
          io.emit('chat-message', msgObj);
        }
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ status: 'ok' }));
      } catch (e) {
        console.error('Error handling chat message:', e);
        res.writeHead(500, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ error: 'Invalid message format' }));
      }
    });
  } else {
    // Serve static files
    express.static(__dirname)(req, res, () => {
      res.statusCode = 404;
      res.end('Not found');
    });
  }
});

// In-memory storage for current session messages
const sessionMessages = [];

// Socket.IO for real-time updates
io.attach(httpServer);

// Handle new connections
io.on('connection', (socket) => {
  // Send message history to newly connected client
  socket.emit('chat-history', sessionMessages);
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

// Start the HTTP server
const PORT = process.env.PORT || 3000;
httpServer.listen(PORT, '0.0.0.0', () => {
  console.log(`Server running on port ${PORT}`);
  console.log(`Visit http://localhost:${PORT} in your browser`);
});

// Handle server errors
httpServer.on('error', (error) => {
  if (error.code === 'EADDRINUSE') {
    console.error(`Port ${PORT} is already in use. Please try a different port.`);
    process.exit(1);
  }
  console.error('Server error:', error);
});

// Legacy chat function
function chat($0, $1) {
	function out( $0, $1 ) {
		if ( $0 ) {
			console.warn( $0 )
			; _1.response.writeHead( 500 )
			; return _1.response.end( 'error' )
			;
		}
		_1.response.writeHead( 200 )
		; _1.response.end( $1 )
		;
	}
	const _1 = new Chat( $0, $1 )
	;
	if ( _1.request.head.url == _1.url ) {
		_1.request.head.on( 'data', $0 => {
			_1.request.string += $0
			;
		} )
		; _1.request.head.on( 'end', () => {
			_1.request.body = _1.parse(
				_1.request.string
			)
			;
		} )
		; _1.request.head.on( 'error', $0 => {
			console.log( $0 )
			;
		} )
		; _1.readFile( _1.file, _1.out )
		; return
		;
	} else if (
		_1.request.head.url == '/favicon.ico'
	) {
		_1.readFile( './favicon.png', _1.out )
		; return
		;
	}
	function Chat( $0, $1 ) {
		this.file = 'index.html'
		; this.out = out
		; this.parse = require( 'querystring' )
			.parse
		; this.readFile = require( 'fs' ).readFile
		; this.request = {}
		; this.request.body = null
		; this.request.head = $0
		; this.request.string = ''
		; this.response = $1
		; this.string = ''
		; this.url = '/ETHGlobal'
		;
	}
}
function connect( $0 ) {
	const _1 = new Connect( $0 )
	; console.log(
		_1.client.handshake.address
			+ ' ' + _1.client.id
			+ ' connected to port ' + _0.port
			+ ' on\n' + _1.client.handshake.time
	)
	; _1.client.on( 'disconnect', () => {
		console.log(
			_1.client.handshake.address
				+ ' ' + _1.client.id
				+ ' disconnected from port '
				+ _0.port + ' on\n'
				+ _1.client.handshake.time
		)
		;
	} )
	; _1.client.on( 'message', $1 => {
		_1.client.emit( 'message', $1 )
		; _0.message( {
			message: $1
			, messenger: _1.client.handshake
				.address + ' ' + _1.client.id
		} )
		;
	} )
	;
	function Connect( $0 ) {
		this.client = $0
		;
	}
}
function message( $0 ) {
	const _1 = new Message( $0 )
	; console.log(
		'From ' + _1.messenger
			+ ':\n' + _1.message
	)
	; _1.spawned = _1.spawn(
		'python'
		, [ 'text.py', $0.message ]
	)
	; _1.spawned.stderr.on( 'data', $0 => {
		console.warn( $0 )
		;
	} )
	;
	function Message( $0 ) {
		this.message = $0.message
		; this.messenger = $0.messenger
		; this.spawn = require( 'child_process' )
			.spawn
		; this.spawned = null
		;
	}
}
function legacyServer() {
	const _1 = new Server
	; _1.server = _1.http( _0.chat )
		  .listen( _0.port, '0.0.0.0', () => {
			  console.log(
				  'shaking hands along port '
				  + _0.port
			  )
			  ;
		  } )
	; _1.server.on( 'error', $0 => {
		console.warn( $0 )
		;
	} )
	; _1.io = _1.socket( _1.server )
	; _1.io.on( 'connection', _0.connect )
	;
	function Server() {
		this.http = require( 'http' )
			.createServer
		; this.io = null
		; this.server = null
		; this.socket = require( 'socket.io' )
		;
	}
}
const _0 = new App
; _0.server()
;
function App() {
	this.chat = chat
	; this.connect = connect
	; this.message = message
	; this.port = 3000
	; this.server = legacyServer
	;
}
