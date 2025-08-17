# Cheerbot - Remote Control with Blockchain Integration

A web-based remote control interface for Cheerbot with real-time blockchain data monitoring for ERC7827 contracts on Flow and Katana networks.

## Features

- Real-time monitoring of ERC7827 contracts
- Support for Flow Mainnet and Katana Tatara networks
- Web-based chat interface
- Responsive design that works on desktop and mobile
- Automatic data refresh every 30 seconds

## Prerequisites

- Node.js 16.0.0 or higher
- npm or yarn
- Access to Flow Mainnet and Katana Tatara networks
- Tailscale for secure remote access (optional)

## Installation

1. Clone the repository:
   ```bash
   git clone <repository-url>
   cd cheerbot-raspi-server
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Configure environment variables (create a `.env` file in the root directory):
   ```env
   PORT=3000
   # Add any other environment-specific variables here
   ```

## Configuration

### Blockchain Settings

Update the blockchain configuration in `config/blockchain.js` with your contract addresses and network settings.

### Flow Contract

Update the Flow contract interaction scripts in `services/flowService.js` to match your ERC7827 contract methods.

### Katana Contract

Update the Katana contract ABI and methods in `services/katanaService.js` to match your ERC7827 contract implementation.

## Running the Application

### Development Mode

```bash
npm start
```

Or directly with Node:

```bash
node app.js
```

### Production Mode

For production, use a process manager like PM2:

```bash
npm install -g pm2
pm2 start app.js --name "cheerbot"
```

### Running as a Service (Raspberry Pi)

1. Create a systemd service file at `/etc/systemd/system/cheerbot.service`:

   ```ini
   [Unit]
   Description=Cheerbot Remote Control
   After=network.target

   [Service]
   ExecStart=/usr/bin/node /path/to/cheerbot-raspi-server/app.js
   WorkingDirectory=/path/to/cheerbot-raspi-server
   User=pi
   Restart=always
   Environment=NODE_ENV=production
   
   [Install]
   WantedBy=multi-user.target
   ```

2. Enable and start the service:
   ```bash
   sudo systemctl daemon-reload
   sudo systemctl enable cheerbot
   sudo systemctl start cheerbot
   ```

## Accessing the Application

Open a web browser and navigate to:
- Local: `http://localhost:3000`
- Remote: `http://<raspberry-pi-ip>:3000`

## API Endpoints

- `GET /api/blockchain-data` - Get current blockchain data
- WebSocket events:
  - `blockchain-update` - Emitted when blockchain data is updated
  - `message` - For chat functionality

## Troubleshooting

### Common Issues

1. **Port in use**: Change the `PORT` in `.env` if port 3000 is already in use.
2. **Blockchain connection issues**:
   - Verify network connectivity
   - Check contract addresses and network configurations
   - Ensure your node has sufficient funds for transactions (if applicable)
3. **Module not found**: Run `npm install` to ensure all dependencies are installed

### Viewing Logs

If running with PM2:
```bash
pm2 logs cheerbot
```

If running as a service:
```bash
sudo journalctl -u cheerbot -f
```

## Security Considerations

- Always run the application behind a reverse proxy (like Nginx) in production
- Use HTTPS with a valid SSL certificate
- Keep dependencies updated
- Never commit sensitive information (private keys, API keys) to version control

## License

[Your License Here]

## Contributing

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Create a new Pull Request
