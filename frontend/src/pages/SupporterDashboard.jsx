import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useWeb3 } from '../context/Web3Context';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { ethers } from 'ethers';

export default function SupporterDashboard() {
  const { user, logout } = useAuth();
  const { account, contract, connectWallet } = useWeb3();
  const navigate = useNavigate();

  const [allContents, setAllContents] = useState([]);
  const [supportAmount, setSupportAmount] = useState('0');

  useEffect(() => {
    if (!user || user.role !== 'supporter') {
      navigate('/login');
    }
  }, [user, navigate]);

  useEffect(() => {
    if (contract && account) {
      fetchAllData();
    }
  }, [contract, account]);

  const fetchAllData = async () => {
    try {
      const amount = await contract.SUPPORT_AMOUNT();
      setSupportAmount(ethers.formatEther(amount));

      const count = await contract.contentCount();
      const contents = [];
      for (let i = 1; i <= count; i++) {
        const c = await contract.contents(i);
        const supporters = await contract.getSupporters(i);
        const hasSupported = await contract.hasSupported(i, account);
        
        contents.push({
          id: i,
          creator: c.creator,
          title: c.title,
          descriptionHash: c.descriptionHash,
          pool: ethers.formatEther(c.pool),
          isViral: c.isViral,
          supportersCount: supporters.length,
          hasSupported: hasSupported
        });
      }
      setAllContents(contents);
    } catch (error) {
      console.error(error);
      toast.error('Failed to fetch contract data');
    }
  };

  const handleSupport = async (content) => {
    if (!contract) return toast.error('Please connect Metamask first');
    
    // Business Rules
    if (content.creator.toLowerCase() === account.toLowerCase()) {
      return toast.error("Creator cannot support own content");
    }
    if (content.hasSupported) {
      return toast.error("Already supported");
    }
    if (content.supportersCount >= 20) {
      return toast.error("Support limit reached");
    }
    if (content.isViral) {
      return toast.error("Content already viral");
    }

    try {
      toast.info('Initiating support transaction...');
      const tx = await contract.support(content.id, { 
        value: ethers.parseEther(supportAmount) 
      });
      await tx.wait();
      toast.success(`Successfully supported! Sent ${supportAmount} ETH`);
      fetchAllData();
    } catch (error) {
      console.error(error);
      toast.error(error.reason || 'Failed to support content');
    }
  };

  return (
    <div className="min-h-screen bg-[#0c0c0e] text-white p-8 font-sans">
      <div className="max-w-6xl mx-auto space-y-8">
        
        {/* Header */}
        <div className="flex justify-between items-center glass p-6 border-b border-gray-800">
          <div>
            <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-green-400 to-emerald-400">Supporter Dashboard</h1>
            <p className="text-gray-400 mt-2">Welcome back, {user?.email}</p>
          </div>
          <div className="flex space-x-4 items-center">
            {account ? (
              <span className="px-4 py-2 bg-emerald-600/20 text-emerald-400 rounded-full text-sm font-mono border border-emerald-500/30">
                {account.substring(0, 6)}...{account.substring(account.length - 4)}
              </span>
            ) : (
              <button 
                onClick={connectWallet} 
                className="px-6 py-2 bg-gradient-to-r from-emerald-600 to-teal-600 rounded-full hover:opacity-90 transition"
              >
                Connect Wallet
              </button>
            )}
            <button onClick={logout} className="px-4 py-2 bg-gray-800 rounded-full text-sm hover:bg-gray-700">Logout</button>
          </div>
        </div>

        {/* Global Stats */}
        <div className="glass p-6 border border-gray-800 mb-8 flex justify-between items-center">
          <div>
            <h3 className="text-gray-400 text-sm font-medium">Platform Fixed Support Amount</h3>
            <p className="text-3xl font-bold mt-2 text-emerald-400">{supportAmount} ETH</p>
          </div>
          <div className="text-right">
            <h3 className="text-gray-400 text-sm font-medium">Total Projects</h3>
            <p className="text-3xl font-bold mt-2 text-white">{allContents.length}</p>
          </div>
        </div>

        {/* Content Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {allContents.map(content => {
            const isCreator = content.creator.toLowerCase() === (account || '').toLowerCase();
            const isDisabled = content.hasSupported || content.isViral || content.supportersCount >= 20 || isCreator;
            
            let btnText = "Support Content";
            if (content.isViral) btnText = "Already Viral";
            else if (content.hasSupported) btnText = "Already Supported";
            else if (content.supportersCount >= 20) btnText = "Limit Reached";
            else if (isCreator) btnText = "Your Content";

            return (
              <div key={content.id} className="glass p-6 border border-gray-800 relative hover:border-emerald-500/30 transition-colors">
                <div className="absolute top-0 right-0 p-4">
                  {content.isViral ? (
                    <span className="bg-yellow-500/20 text-yellow-300 px-3 py-1 rounded-full text-xs font-bold border border-yellow-500/30">🔥 VIRAL</span>
                  ) : (
                    <span className="bg-emerald-500/20 text-emerald-400 px-3 py-1 rounded-full text-xs font-bold border border-emerald-500/30">ACTIVE</span>
                  )}
                </div>
                
                <h3 className="text-xl font-bold mb-1 mt-4">{content.title}</h3>
                <p className="text-xs text-gray-500 font-mono truncate mb-4">By: {content.creator}</p>
                <p className="text-sm text-gray-400 mb-6 truncate">{content.descriptionHash}</p>
                
                <div className="grid grid-cols-2 gap-4 mb-6">
                  <div className="bg-[#111] p-3 rounded-lg border border-gray-800">
                    <p className="text-xs text-gray-500">Supporters</p>
                    <p className="text-lg font-bold">{content.supportersCount} / 20</p>
                  </div>
                  <div className="bg-[#111] p-3 rounded-lg border border-gray-800">
                    <p className="text-xs text-gray-500">Pool (ETH)</p>
                    <p className="text-lg font-bold text-emerald-400">{content.pool}</p>
                  </div>
                </div>

                <div className="w-full bg-gray-800 rounded-full h-2 mb-6">
                  <div 
                    className="bg-emerald-500 h-2 rounded-full" 
                    style={{ width: `${(content.supportersCount / 20) * 100}%` }}
                  ></div>
                </div>

                <button 
                  onClick={() => handleSupport(content)}
                  disabled={isDisabled}
                  className={`w-full py-3 rounded-xl font-semibold transition ${
                    isDisabled 
                      ? 'bg-gray-800 text-gray-500 cursor-not-allowed' 
                      : 'bg-white text-black hover:bg-gray-200'
                  }`}
                >
                  {btnText}
                </button>
              </div>
            );
          })}
        </div>

      </div>
    </div>
  );
}
