# Cheerbot Raspberry Pi Server Setup

This documentation provides step-by-step instructions to set up and run the Cheerbot server on a Raspberry Pi.

## Prerequisites
- Raspberry Pi with Node.js installed
- Tailscale installed on both your local machine and Raspberry Pi
- SSH access to the Raspberry Pi

## Setup Instructions

### 1. Connect to Raspberry Pi Network
Ensure both your local machine and the Raspberry Pi are connected to the same Tailscale network.

### 2. SSH into Raspberry Pi
```bash
ssh <raspberry-pi-username>@<raspberry-pi-tailscale-ip>
```

### 3. Navigate to Application Directory
```bash
cd /path/to/cheerbot-raspi-server
```

### 4. Install Dependencies
```bash
npm install
```

### 5. Run the Server
To keep the server running after disconnecting from SSH, use `screen`:

```bash
# Create a new screen session
screen -S dev

# Start the server
node app.js

# Detach from the screen session (press Ctrl+A then D)
```

### 6. Access the Server
Open a web browser and navigate to:
```
http://<raspberry-pi-ip>:3000/ETHGlobal
```

## Managing the Server

### Reattach to the Screen Session
```bash
screen -r dev
```

### Stop the Server
1. Reattach to the screen session
2. Press Ctrl+C to stop the server
3. Type `exit` to close the screen session

## Troubleshooting
- If you can't connect, ensure the Raspberry Pi's firewall allows port 3000
- Check server logs in the screen session for any errors
- Verify Tailscale is connected on both devices with `tailscale status`
- Make sure no other service is using port 3000
