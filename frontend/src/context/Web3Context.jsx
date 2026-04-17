import React, { createContext, useContext, useState, useEffect } from 'react';
import { ethers } from 'ethers';
import { CONFIG } from '../config';

const Web3Context = createContext(null);

export const Web3Provider = ({ children }) => {
  const [account, setAccount] = useState(null);
  const [contract, setContract] = useState(null);
  const [provider, setProvider] = useState(null);

  const connectWallet = async () => {
    if (window.ethereum) {
      try {
        const _provider = new ethers.BrowserProvider(window.ethereum);
        setProvider(_provider);

        // Request account access if needed
        await window.ethereum.request({ method: 'eth_requestAccounts' });

        const _signer = await _provider.getSigner();
        const address = await _signer.getAddress();
        setAccount(address);

        // Intialize contract
        const _contract = new ethers.Contract(CONFIG.CONTRACT_ADDRESS, CONFIG.ABI, _signer);
        setContract(_contract);
      } catch (error) {
        console.error("Wallet connection failed", error);
      }
    } else {
      console.log('Non-Ethereum browser detected. You should consider trying MetaMask!');
    }
  };

  useEffect(() => {
    if (window.ethereum) {
      window.ethereum.on('accountsChanged', (accounts) => {
        if (accounts.length > 0) {
          setAccount(accounts[0]);
          connectWallet();
        } else {
          setAccount(null);
          setContract(null);
        }
      });
      window.ethereum.on('chainChanged', () => {
        window.location.reload();
      });
    }
  }, []);

  return (
    <Web3Context.Provider value={{ account, contract, connectWallet, provider }}>
      {children}
    </Web3Context.Provider>
  );
};

export const useWeb3 = () => useContext(Web3Context);
