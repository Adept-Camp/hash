const knownContracts = require('./known-contracts');
const {bacPools, POOL_START_DATE} = require('./pools');

// Tokens
// deployed first
const Dollar = artifacts.require('Dollar');
const MockDai = artifacts.require('MockDai');

// ============ Main Migration ============
module.exports = async (deployer, network, accounts) => {
    for await (const {contractName, token} of bacPools) {
        const tokenAddress = knownContracts[token][network] || MockDai.address;
        if (!tokenAddress) {
            // network is mainnet, so MockDai is not available
            throw new Error(`Address of ${token} is not registered on migrations/known-contracts.js!`);
        }

        const contract = artifacts.require(contractName);
        await deployer.deploy(contract, Dollar.address, tokenAddress, POOL_START_DATE);
    }
};
