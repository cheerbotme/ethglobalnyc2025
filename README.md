# The Flow x402 Cheerbot aka the ETHGlobal NYC 2025 Cheerbot Build

<img width="1024" height="1024" alt="ETHGlobal_Cheerbot" src="https://github.com/user-attachments/assets/12a70025-8231-421d-aead-2ce2e8177420" />

## contextual links

[2minutepitch.cheerbot.org](http://2minutepitch.cheerbot.org)

[3minutepitch.cheerbot.org](http://3minutepitch.cheerbot.org)

[proto ERC 7827](https://arbiscan.io/address/0x8dcbc12efe584e24592d07a81bd6f6450def1052#code)

[MegaZu deck](https://docs.google.com/presentation/d/1zW4OyzT3wvKzafJfaEAlNCTtUXd-3JhwKGWeZuHefJ0/edit?usp=sharing)

[eth-lightShow](https://github.com/kaustavha/eth-lightShow-uottahack/blob/b1ecba5ea6d9ce3682b3eb1ed087014208e95395/contracts/1OnOff.sol)

## Raspberry Pi instructions

This build uses a Raspberry Pi Zero 2 W.

### tailscale on community wifi failure (still need hotspot)

We tested tailscale as an alternative to our hotspot solution. However, without access to ETHGlobal's router, we couldn't build out our hardware tech stack in this area. If it worked, that'd have been fine. But we couldn't troubleshoot because we didn't have access to router information. 

* Learning lesson: ETH values encourage figuring out a router management that is not based on information asymmetry security for pathways we all rely on. Will pass along to ZuLink. 

### create the RPi OS by flashing the SD 

1. Download the Raspberry Pi imager on your laptop or desktop. Choose the Raspberry Pi Zero 2 W device. Choose the 32 bit Raspberry Pi OS operating system. Choose an SD storage you'll have to pug into your laptop or desktop. Click next.
   
2. In settings, click on "edit" tab and fill general out with your specifics. Here's bestape's specifics at ETHGlobal NYC 2025 using his hotspot (unfortunately! we'll have tailscale next time):

<img width="438" height="698" alt="image" src="https://github.com/user-attachments/assets/bddb1681-35cf-4279-8501-b9bfd46d5a35" />

3. Click on the "services" tab and turn on SSH. Then close the window.

<img width="424" height="336" alt="image" src="https://github.com/user-attachments/assets/ae28776a-c671-4a6b-9f76-629164f43ab9" />

4. Exit edit settings, then click yes to apply OS customization. Follow through to flash the SD.

### install the "startup engineering" dotfiles

These dotfiles are forked from Balaji's original [Startup Engineering](https://github.com/startup-class/dotfiles) dotfiles.

1. Plug the SD into the Raspberry Pi, then plug it in.

2. Wait until the Pi joins your laptop's or desktop's wifi then ssh into it with whatever you set local to. In our case, that's `ssh bestape@cheer.local`.

3. Enter the `git clone https://github.com/bestape/.0.sh` command.

4. Enter the `cd .0.sh` command.

5. Enter the `./setup.sh` command and follow the instructions.

6. Exit the Pi and log back in for the new shell.

7. Enter `sudo apt install curl`.

8. Enter `sudo apt install emacs`.

9. Enter `sudo apt install nodejs`.
   
10. Enter `sudo apt install screen`.

### install Pimoroni Unicorn HD and test it

1. Enter `screen -S sprite`.

2. Go to [https://github.com/pimoroni/unicorn-hat-hd](https://github.com/pimoroni/unicorn-hat-hd) and follow the installation instructions.

3. Do not use the pip environment.

4. Copy the /sprite file sharaed in this repository to test the LED. If you don't know how to do that, look up the `scp` command.
   
5. Navigate to the /sprite file location on the RPi and run `screen -S sprite`.

6. Enter `sprite.py` and the animations should run.

7. Type `CTRL+t` then `d` to detatch from the screen instance.

### install tailscale and host a website

1. Enter `screen -S website`

2. Enter `curl -fsSL https://tailscale.com/install.sh | sh` and follow the instructions.

3. Enter `git clone https://github.com/cheerbotme/webmonetization.git`.

4. Enter `em webmonetization/cheerbot/app.js`.

5. Change the `port` value in `App` to `'0.0.0.0'`.

6. Change `.listen( _0.port, () => {` to `.listen( _0.port, '0.0.0.0', () => {`.

7. Change the `url` value in `Chat` to `ETHGlobal`.

8. Enter `sudo apt install npm`.

9. Enter `npm install socket.io`.

11. Enter `chmod 774 app.js`.

12. Enter `./app.js`.

13. In your laptop or desktop that is connected to the same tailscale server, look up the RPi's tailscale IP and then enter `http://<YOUR RPi's TAILSCALE IP>:3000/ETHGlobal` into your address bar.

It won't work out of the box because it relies on Coil. So, if you try to type something it will give you this message:

<img width="611" height="261" alt="image" src="https://github.com/user-attachments/assets/1aa3a1a1-0ae6-456e-ba25-594441358d55" />

You can test it by commenting out these sections of `index.html`:

<img width="514" height="495" alt="image" src="https://github.com/user-attachments/assets/08f6db61-9461-490f-a783-d63029050e42" />

=======
# ethglobal-nyc-25

Idea:   
Yield bearing bridge   
Using layer zero vault bridge tech   
With katana as the hub chain generating yield   
A bridge that incentivizes users using yield to direct liquidity to target partner chains    

# llm output 
<<<<<<< HEAD
Combined: LiquidityYield Bridge ("YieldMesh")
Core Concept. 
A unified platform that provides cross-chain liquidity and yield optimization, where the platform captures the difference between optimal yields and user-allocated yields through intelligent fund management.
Revenue Model: Yield Spread Capture
Primary Revenue Stream: Yield Optimization Spread
>>>>>>> 5dfc847 (add initial idea spec)
=======
Combined: LiquidityYield Bridge ("YieldMesh")     
Core Concept.     
A unified platform that provides cross-chain liquidity and yield optimization, where the platform captures the difference between optimal yields and user-allocated yields through intelligent fund management.     
Revenue Model: Yield Spread Capture     
Primary Revenue Stream: Yield Optimization Spread     
>>>>>>> c288c03 (Update README.md)
