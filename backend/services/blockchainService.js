/**
 * Blockchain Service Module
 * Handles Web3 connections and smart contract interactions for farmer registration
 * 
 * Supported Networks:
 * - Ethereum Testnet (Goerli/Sepolia)
 * - Polygon Testnet (Mumbai)
 * - Polygon Mainnet
 */

import Web3 from 'web3';
import { ethers } from 'ethers';
import dotenv from 'dotenv';

dotenv.config();

// Configuration
const BLOCKCHAIN_CONFIG = {
  network: process.env.BLOCKCHAIN_NETWORK || 'polygon-mumbai',
  rpcUrl: process.env.BLOCKCHAIN_RPC_URL || 'https://rpc-mumbai.maticvigil.com',
  contractAddress: process.env.FARMER_REGISTRY_CONTRACT_ADDRESS,
  privateKey: process.env.BLOCKCHAIN_PRIVATE_KEY,
  gasLimit: parseInt(process.env.BLOCKCHAIN_GAS_LIMIT || '300000'),
};

let web3Instance = null;
let contractInstance = null;

/**
 * Initialize Web3 connection
 * @returns {Web3} Web3 instance
 */
export const initializeWeb3 = () => {
  try {
    if (!web3Instance) {
      web3Instance = new Web3(BLOCKCHAIN_CONFIG.rpcUrl);
      console.log(`✅ Web3 initialized on ${BLOCKCHAIN_CONFIG.network}`);
    }
    return web3Instance;
  } catch (error) {
    console.error('❌ Failed to initialize Web3:', error.message);
    throw error;
  }
};

/**
 * Get or initialize Web3 instance
 */
export const getWeb3 = () => {
  if (!web3Instance) {
    return initializeWeb3();
  }
  return web3Instance;
};

/**
 * Initialize smart contract instance
 * @param {string} contractABI - Contract ABI
 * @returns {object} Contract instance
 */
export const initializeContract = (contractABI) => {
  try {
    const web3 = getWeb3();
    if (!BLOCKCHAIN_CONFIG.contractAddress) {
      throw new Error('FARMER_REGISTRY_CONTRACT_ADDRESS not configured');
    }
    
    contractInstance = new web3.eth.Contract(
      contractABI,
      BLOCKCHAIN_CONFIG.contractAddress
    );
    console.log(`✅ Contract initialized at ${BLOCKCHAIN_CONFIG.contractAddress}`);
    return contractInstance;
  } catch (error) {
    console.error('❌ Failed to initialize contract:', error.message);
    throw error;
  }
};

/**
 * Generate a blockchain wallet for a farmer
 * @returns {object} { address, privateKey }
 */
export const generateFarmerWallet = () => {
  try {
    const wallet = ethers.Wallet.createRandom();
    return {
      address: wallet.address,
      privateKey: wallet.privateKey,
      mnemonic: wallet.mnemonic?.phrase || null
    };
  } catch (error) {
    console.error('❌ Failed to generate wallet:', error.message);
    throw error;
  }
};

/**
 * Register farmer on blockchain
 * @param {object} farmerData - Farmer registration data
 * @param {string} farmerData.farmerId - Unique digital farmer ID
 * @param {string} farmerData.detailsHash - SHA-256 hash of farmer details
 * @param {number} farmerData.timestamp - Registration timestamp
 * @param {string} farmerData.walletAddress - Farmer's wallet address
 * @returns {object} Transaction receipt
 */
export const registerFarmerOnBlockchain = async (farmerData) => {
  try {
    if (!contractInstance) {
      throw new Error('Contract not initialized. Call initializeContract first.');
    }

    const web3 = getWeb3();
    
    if (!BLOCKCHAIN_CONFIG.privateKey) {
      throw new Error('BLOCKCHAIN_PRIVATE_KEY not configured');
    }

    // Get account from private key
    const account = web3.eth.accounts.privateKeyToAccount(BLOCKCHAIN_CONFIG.privateKey);
    web3.eth.accounts.wallet.add(account);

    // Build transaction data
    const txData = contractInstance.methods.registerFarmer(
      farmerData.farmerId,
      farmerData.detailsHash,
      farmerData.timestamp,
      farmerData.walletAddress || account.address
    ).encodeABI();

    // Get gas estimate
    const gasEstimate = await web3.eth.estimateGas({
      from: account.address,
      to: BLOCKCHAIN_CONFIG.contractAddress,
      data: txData,
    });

    const gasPrice = await web3.eth.getGasPrice();

    // Create and sign transaction
    const tx = {
      from: account.address,
      to: BLOCKCHAIN_CONFIG.contractAddress,
      data: txData,
      gas: Math.min(gasEstimate, BLOCKCHAIN_CONFIG.gasLimit),
      gasPrice: gasPrice,
      nonce: await web3.eth.getTransactionCount(account.address),
    };

    const signedTx = await web3.eth.accounts.signTransaction(tx, BLOCKCHAIN_CONFIG.privateKey);

    // Send transaction
    const receipt = await web3.eth.sendSignedTransaction(signedTx.rawTransaction);
    
    console.log(`✅ Farmer registered on blockchain. Tx: ${receipt.transactionHash}`);
    
    return {
      success: true,
      transactionHash: receipt.transactionHash,
      blockNumber: receipt.blockNumber,
      gasUsed: receipt.gasUsed,
      from: receipt.from,
    };
  } catch (error) {
    console.error('❌ Blockchain registration failed:', error.message);
    throw error;
  }
};

/**
 * Verify farmer on blockchain
 * @param {string} farmerId - Digital farmer ID
 * @returns {object} Farmer verification data
 */
export const verifyFarmerOnBlockchain = async (farmerId) => {
  try {
    if (!contractInstance) {
      throw new Error('Contract not initialized. Call initializeContract first.');
    }

    const farmerRecord = await contractInstance.methods.getFarmerRecord(farmerId).call();
    
    return {
      farmerId: farmerRecord.farmerId,
      detailsHash: farmerRecord.detailsHash,
      registrationTimestamp: parseInt(farmerRecord.registrationTimestamp),
      walletAddress: farmerRecord.walletAddress,
      verified: farmerRecord.verified,
      registrationDate: new Date(parseInt(farmerRecord.registrationTimestamp) * 1000)
    };
  } catch (error) {
    console.error('❌ Blockchain verification failed:', error.message);
    throw error;
  }
};

/**
 * Get all registered farmers from blockchain (paginated)
 * @param {number} limit - Number of records to fetch
 * @param {number} offset - Offset for pagination
 * @returns {array} Array of farmer records
 */
export const getAllFarmersFromBlockchain = async (limit = 100, offset = 0) => {
  try {
    if (!contractInstance) {
      throw new Error('Contract not initialized. Call initializeContract first.');
    }

    const totalFarmers = await contractInstance.methods.getFarmerCount().call();
    const farmers = [];

    for (let i = offset; i < Math.min(offset + limit, parseInt(totalFarmers)); i++) {
      const farmerId = await contractInstance.methods.farmerIdsByIndex(i).call();
      const record = await contractInstance.methods.getFarmerRecord(farmerId).call();
      farmers.push(record);
    }

    return {
      total: parseInt(totalFarmers),
      limit,
      offset,
      farmers
    };
  } catch (error) {
    console.error('❌ Failed to fetch farmers from blockchain:', error.message);
    throw error;
  }
};

/**
 * Update farmer verification status on blockchain
 * @param {string} farmerId - Digital farmer ID
 * @param {boolean} verified - Verification status
 * @returns {object} Transaction receipt
 */
export const updateFarmerVerificationStatus = async (farmerId, verified) => {
  try {
    if (!contractInstance) {
      throw new Error('Contract not initialized. Call initializeContract first.');
    }

    const web3 = getWeb3();
    const account = web3.eth.accounts.privateKeyToAccount(BLOCKCHAIN_CONFIG.privateKey);
    web3.eth.accounts.wallet.add(account);

    const txData = contractInstance.methods.updateVerificationStatus(farmerId, verified).encodeABI();

    const gasEstimate = await web3.eth.estimateGas({
      from: account.address,
      to: BLOCKCHAIN_CONFIG.contractAddress,
      data: txData,
    });

    const gasPrice = await web3.eth.getGasPrice();

    const tx = {
      from: account.address,
      to: BLOCKCHAIN_CONFIG.contractAddress,
      data: txData,
      gas: Math.min(gasEstimate, BLOCKCHAIN_CONFIG.gasLimit),
      gasPrice: gasPrice,
      nonce: await web3.eth.getTransactionCount(account.address),
    };

    const signedTx = await web3.eth.accounts.signTransaction(tx, BLOCKCHAIN_CONFIG.privateKey);
    const receipt = await web3.eth.sendSignedTransaction(signedTx.rawTransaction);

    return {
      success: true,
      transactionHash: receipt.transactionHash,
      blockNumber: receipt.blockNumber,
    };
  } catch (error) {
    console.error('❌ Failed to update verification status:', error.message);
    throw error;
  }
};

/**
 * Get transaction status
 * @param {string} transactionHash - Transaction hash
 * @returns {object} Transaction details
 */
export const getTransactionStatus = async (transactionHash) => {
  try {
    const web3 = getWeb3();
    const receipt = await web3.eth.getTransactionReceipt(transactionHash);
    
    if (!receipt) {
      return { status: 'pending', confirmed: false };
    }

    return {
      status: receipt.status ? 'success' : 'failed',
      confirmed: true,
      blockNumber: receipt.blockNumber,
      gasUsed: receipt.gasUsed,
      from: receipt.from,
      to: receipt.to,
    };
  } catch (error) {
    console.error('❌ Failed to get transaction status:', error.message);
    throw error;
  }
};

export default {
  initializeWeb3,
  getWeb3,
  initializeContract,
  generateFarmerWallet,
  registerFarmerOnBlockchain,
  verifyFarmerOnBlockchain,
  getAllFarmersFromBlockchain,
  updateFarmerVerificationStatus,
  getTransactionStatus,
};
