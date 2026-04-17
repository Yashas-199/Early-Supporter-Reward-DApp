import React, { createContext, useContext, useState, useEffect } from 'react';
import { ethers } from 'ethers';
import { toast } from 'react-toastify';
import { CONFIG } from '../config';

const Web3Context = createContext(null);

export const Web3Provider = ({ children }) => {
  const [account, setAccount] = useState(null);
  const [contract, setContract] = useState(null);
  const [provider, setProvider] = useState(null);
  const [isConnecting, setIsConnecting] = useState(false);

  const connectWallet = async () => {
    if (isConnecting) {
      toast.warning('Connection already in progress. Please wait...');
      return;
    }

    try {
      setIsConnecting(true);

      // Clear previous state first
      setAccount(null);
      setContract(null);
      setProvider(null);

      if (!window.ethereum) {
        toast.error('MetaMask not detected. Please install it!');
        return;
      }

      // REVOKE PREVIOUS PERMISSIONS FIRST - forces fresh MetaMask popup
      try {
        await window.ethereum.request({
          method: 'wallet_revokePermissions',
          params: [{ eth_accounts: {} }]
        });
      } catch (revokeError) {
        // Ignore if revoke not supported or fails - continue anyway
        console.log('wallet_revokePermissions not supported or failed:', revokeError.message);
      }

      const _provider = new ethers.BrowserProvider(window.ethereum);
      setProvider(_provider);

      // Request account access - should show popup now
      const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
      
      if (!accounts || accounts.length === 0) {
        toast.error('No accounts found. Please check MetaMask.');
        return;
      }

      const _signer = await _provider.getSigner();
      const address = await _signer.getAddress();
      setAccount(address);
      toast.success(`Wallet connected: ${address.substring(0, 6)}...${address.substring(address.length - 4)}`);

      // Initialize contract
      if (CONFIG.CONTRACT_ADDRESS && CONFIG.CONTRACT_ADDRESS !== '0x...') {
        const _contract = new ethers.Contract(CONFIG.CONTRACT_ADDRESS, CONFIG.ABI, _signer);
        setContract(_contract);
      } else {
        toast.error('Contract address not configured!');
      }
    } catch (error) {
      console.error("Wallet connection failed", error);
      toast.error(`Error: ${error.message}`);
    } finally {
      setIsConnecting(false);
    }
  };

  useEffect(() => {
    if (window.ethereum) {
      window.ethereum.on('accountsChanged', (accounts) => {
        // Account changed - clear everything to force fresh connection
        setAccount(null);
        setContract(null);
        setProvider(null);
        toast.info('Wallet account changed. Please reconnect.');
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
