# The Flow x402 Cheerbot aka the ETHGlobal NYC 2025 Cheerbot Build

<img width="1024" height="1024" alt="ETHGlobal_Cheerbot" src="https://github.com/user-attachments/assets/12a70025-8231-421d-aead-2ce2e8177420" />

## contextual links

[2minutepitch.cheerbot.org](http://2minutepitch.cheerbot.org)

[3minutepitch.cheerbot.org](http://3minutepitch.cheerbot.org)

[proto ERC 7827](https://arbiscan.io/address/0x8dcbc12efe584e24592d07a81bd6f6450def1052#code)

[MegaZu deck](https://docs.google.com/presentation/d/1zW4OyzT3wvKzafJfaEAlNCTtUXd-3JhwKGWeZuHefJ0/edit?usp=sharing)

## Raspberry Pi instructions

This build uses a Raspberry Pi Zero 2 W.

### tailscale failure

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

1. Plug the SD into the Raspberry Pi, then plug it in.

2. Wait until the Pi joins your laptop's or desktop's wifi then ssh into it with 

3. Enter the `git clone https://github.com/bestape/.0.sh` command.

4. Enter the `cd .0.sh` command.

5. Enter the `./setup.sh` command and follow the instructions.

6. Exit the Pi and log back in for the new shell.

### install Pimoroni Unicorn HD

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
