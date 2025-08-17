
const { ethers } = require('ethers');
const { expect } = require('chai');
const { spawn } = require('child_process');
const fs = require('fs');
const path = require('path');
const ERC7827 = require('../src/ERC7827.js');

// --- Test Setup ---
const CONTRACT_ARTIFACT_PATH = path.resolve(process.cwd(), '../erc7827-contract/out/ERC7827.sol/ERC7827.json');
const ANVIL_PORT = 8545;
const RPC_URL = `http://127.0.0.1:${ANVIL_PORT}`;

describe('ERC7827.js Library', function () {
    this.timeout(20000); 

    let provider;
    let owner, nonOwner;
    let erc7827, erc7827_nonOwner;
    let anvilProcess;
    let contractArtifact;
    let factory;

    before((done) => {
        try {
            const artifactFile = fs.readFileSync(CONTRACT_ARTIFACT_PATH, 'utf8');
            contractArtifact = JSON.parse(artifactFile);
        } catch (err) {
            return done(new Error(`Failed to read contract artifact. Make sure the contract is compiled. Error: ${err.message}`));
        }

        anvilProcess = spawn('anvil', ['-p', ANVIL_PORT]);
        
        let anvilReady = false;
        const setupTestEnvironment = async () => {
            if (anvilReady) return;
            anvilReady = true;

            try {
                provider = new ethers.JsonRpcProvider(RPC_URL);
                owner = new ethers.Wallet('0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80', provider);
                nonOwner = new ethers.Wallet('0x59c6995e998f97a5a0044966f0945389dc9e86dae88c7a8412f4603b6b78690d', provider);
                factory = new ethers.ContractFactory(contractArtifact.abi, contractArtifact.bytecode.object, owner);
                done();
            } catch (err) {
                done(err);
            }
        };

        anvilProcess.stdout.on('data', (data) => {
            if (data.toString().includes('Listening on')) {
                setTimeout(setupTestEnvironment, 500);
            }
        });

        anvilProcess.on('close', (code) => {
            if (code !== 0 && !anvilReady) {
                done(new Error(`Anvil process exited with code ${code}.`));
            }
        });
    });

    after(() => {
        if (anvilProcess) anvilProcess.kill();
    });

    beforeEach(async () => {
        const deployedContract = await factory.deploy();
        const contractAddress = await deployedContract.getAddress();
        erc7827 = new ERC7827(contractAddress, owner);
        erc7827_nonOwner = new ERC7827(contractAddress, nonOwner);
    });

    describe('Read Operations', () => {
        it('should get an empty JSON object initially', async () => {
            const json = await erc7827.getJson();
            expect(json).to.deep.equal({});
        });

        it('should get the correct owner', async () => {
            const contractOwner = await erc7827.getOwner();
            expect(contractOwner).to.equal(owner.address);
        });
    });

    describe('Write Operations & State Changes', () => {
        it('should write a key-value pair and update state', async () => {
            const tx = await erc7827.write(['name'], ['Alice'], false);
            await tx.wait();
            const json = await erc7827.getJson();
            expect(json.name).to.equal('Alice');
            expect(await erc7827.getTotalKeys()).to.equal(1);
        });

        it('should update a key and check version history', async () => {
            await (await erc7827.write(['name'], ['Alice'], false)).wait();
            await (await erc7827.write(['name'], ['Bob'], true)).wait();
            
            const history = await erc7827.getVersion('name');
            expect(history).to.deep.equal(['Alice', 'Bob']);
            const value = await erc7827.getValueAt('name', 0);
            expect(value).to.equal('Alice');
        });
    });

    describe('Access Control', () => {
        it('should NOT allow a non-owner to write', async () => {
            try {
                await erc7827_nonOwner.write(['city'], ['New York'], false);
                expect.fail("Write should have reverted for non-owner");
            } catch (error) {
                expect(error.code).to.equal('CALL_EXCEPTION');
            }
        });

        it('should allow ownership transfer and enforce new roles', async () => {
            await (await erc7827.transferOwnership(nonOwner.address)).wait();
            expect(await erc7827.getOwner()).to.equal(nonOwner.address);

            // The new owner (nonOwner) can write
            const tx = await erc7827_nonOwner.write(['status'], ['active'], false);
            await tx.wait();
            const json = await erc7827_nonOwner.getJson();
            expect(json.status).to.equal('active');

            // The old owner cannot write
            try {
                await erc7827.write(['server'], ['offline'], false);
                expect.fail("Write should have reverted for the old owner");
            } catch (error) {
                expect(error.code).to.equal('CALL_EXCEPTION');
            }
        });
    });
});
