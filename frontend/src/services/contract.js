import { ethers } from 'ethers';
import { CONFIG } from '../config';

export const getProvider = () => {
    if (window.ethereum) {
        return new ethers.BrowserProvider(window.ethereum);
    }
    return null;
}

export const getContract = async () => {
    const provider = getProvider();
    if (!provider) return null;
    const signer = await provider.getSigner();
    return new ethers.Contract(CONFIG.CONTRACT_ADDRESS, CONFIG.ABI, signer);
}

export const registerContent = async (contract, title, descriptionHash) => {
    return await contract.registerContent(title, descriptionHash);
};

export const supportContent = async (contract, id, amount) => {
    return await contract.support(id, { value: amount });
};

export const markViral = async (contract, id) => {
    return await contract.markViral(id);
};

export const getContentDetails = async (contract, id) => {
    return await contract.contents(id);
};

export const getSupporters = async (contract, id) => {
    return await contract.getSupporters(id);
};

export const getPoolBalance = async (contract, id) => {
    return await contract.getPool(id);
};

export const getHasSupported = async (contract, id, address) => {
    return await contract.hasSupported(id, address);
};
