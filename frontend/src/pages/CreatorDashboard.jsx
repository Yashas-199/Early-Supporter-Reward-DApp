import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useWeb3 } from '../context/Web3Context';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { ethers } from 'ethers';

export default function CreatorDashboard() {
  const { user, logout } = useAuth();
  const { account, contract, connectWallet } = useWeb3();
  const navigate = useNavigate();

  const [title, setTitle] = useState('');
  const [descriptionHash, setDescriptionHash] = useState('');
  const [myContents, setMyContents] = useState([]);
  const [contentCount, setContentCount] = useState(0);

  useEffect(() => {
    if (!user || user.role !== 'creator') {
      navigate('/login');
    }
  }, [user, navigate]);

  useEffect(() => {
    if (contract && account) {
      fetchCreatorData();
    }
  }, [contract, account]);

  const fetchCreatorData = async () => {
    try {
      const count = await contract.contentCount();
      setContentCount(Number(count));

      const contents = [];
      for (let i = 1; i <= count; i++) {
        const c = await contract.contents(i);
        if (c.creator.toLowerCase() === account.toLowerCase()) {
          const supporters = await contract.getSupporters(i);
          contents.push({
            id: i,
            title: c.title,
            descriptionHash: c.descriptionHash,
            pool: ethers.formatEther(c.pool),
            isViral: c.isViral,
            supportersCount: supporters.length,
            supportersList: supporters
          });
        }
      }
      setMyContents(contents);
    } catch (error) {
      console.error(error);
      toast.error('Failed to fetch contract data');
    }
  };

  const handleRegisterContent = async (e) => {
    e.preventDefault();
    if (!contract) return toast.error('Please connect Metamask first');
    
    try {
      const tx = await contract.registerContent(title, descriptionHash);
      toast.info('Transaction pending...');
      await tx.wait();
      toast.success('Content registered!');
      setTitle('');
      setDescriptionHash('');
      fetchCreatorData();
    } catch (error) {
      console.error(error);
      toast.error('Failed to register content');
    }
  };

  const handleMakeViral = async (id) => {
    try {
      const tx = await contract.markViral(id);
      toast.info('Marking content as viral...');
      await tx.wait();
      toast.success('Content is now Viral!');
      fetchCreatorData();
    } catch (error) {
      console.error(error);
      toast.error('Failed to make viral');
    }
  };

  return (
    <div className="min-h-screen bg-[#0c0c0e] text-white p-8 font-sans">
      <div className="max-w-6xl mx-auto space-y-8">
        
        {/* Header */}
        <div className="flex justify-between items-center glass p-6 border-b border-gray-800">
          <div>
            <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-indigo-400">Creator Dashboard</h1>
            <p className="text-gray-400 mt-2">Welcome back, {user?.email}</p>
          </div>
          <div className="flex space-x-4 items-center">
            {account ? (
              <span className="px-4 py-2 bg-indigo-600/20 text-indigo-400 rounded-full text-sm font-mono border border-indigo-500/30">
                {account.substring(0, 6)}...{account.substring(account.length - 4)}
              </span>
            ) : (
              <button 
                onClick={connectWallet} 
                className="px-6 py-2 bg-gradient-to-r from-purple-600 to-indigo-600 rounded-full hover:opacity-90 transition"
              >
                Connect Wallet
              </button>
            )}
            <button onClick={logout} className="px-4 py-2 bg-gray-800 rounded-full text-sm hover:bg-gray-700">Logout</button>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="glass p-6 border border-gray-800">
            <h3 className="text-gray-400 text-sm font-medium">Total Global Contents</h3>
            <p className="text-4xl font-bold mt-2">{contentCount}</p>
          </div>
          <div className="glass p-6 border border-gray-800">
            <h3 className="text-gray-400 text-sm font-medium">My Contents</h3>
            <p className="text-4xl font-bold mt-2 text-purple-400">{myContents.length}</p>
          </div>
        </div>

        {/* Register Content Form */}
        <div className="glass p-8 border border-gray-800 w-full max-w-2xl">
          <h2 className="text-xl font-semibold mb-6 flex items-center gap-2">
            <span className="w-8 h-8 rounded-lg bg-purple-500/20 flex items-center justify-center text-purple-400">✨</span>
            Launch New Content
          </h2>
          <form onSubmit={handleRegisterContent} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-400 mb-1">Title</label>
              <input
                type="text"
                required
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full px-4 py-3 bg-[#111] border border-gray-800 rounded-xl focus:border-purple-500 focus:outline-none transition text-white placeholder-gray-600"
                placeholder="e.g. Next-Gen Protocol"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-400 mb-1">Description Hash</label>
              <input
                type="text"
                required
                value={descriptionHash}
                onChange={(e) => setDescriptionHash(e.target.value)}
                className="w-full px-4 py-3 bg-[#111] border border-gray-800 rounded-xl focus:border-purple-500 focus:outline-none transition text-white placeholder-gray-600"
                placeholder="IPFS hash or similar"
              />
            </div>
            <button 
              type="submit" 
              className="w-full py-3 bg-white text-black font-semibold rounded-xl hover:bg-gray-200 transition"
            >
              Register Content
            </button>
          </form>
        </div>

        {/* My Contents */}
        <div>
          <h2 className="text-2xl font-bold mb-6">My Live Contents</h2>
          {myContents.length === 0 ? (
            <p className="text-gray-500 italic">No content created yet. Start building!</p>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {myContents.map(content => (
                <div key={content.id} className="glass p-6 border border-gray-800 relative overflow-hidden">
                  <div className="absolute top-0 right-0 p-4">
                    {content.isViral ? (
                      <span className="bg-yellow-500/20 text-yellow-300 px-3 py-1 rounded-full text-xs font-bold border border-yellow-500/30">🔥 VIRAL</span>
                    ) : (
                      <span className="bg-green-500/20 text-green-400 px-3 py-1 rounded-full text-xs font-bold border border-green-500/30">ACTIVE</span>
                    )}
                  </div>
                  
                  <h3 className="text-xl font-bold mb-1">{content.title}</h3>
                  <p className="text-sm text-gray-400 mb-4 font-mono truncate">Hash: {content.descriptionHash}</p>
                  
                  <div className="grid grid-cols-2 gap-4 mb-6">
                    <div className="bg-[#111] p-3 rounded-lg border border-gray-800">
                      <p className="text-xs text-gray-500">Supporters</p>
                      <p className="text-lg font-bold">{content.supportersCount} / 20</p>
                    </div>
                    <div className="bg-[#111] p-3 rounded-lg border border-gray-800">
                      <p className="text-xs text-gray-500">Pool (ETH)</p>
                      <p className="text-lg font-bold text-indigo-400">{content.pool}</p>
                    </div>
                  </div>

                  {!content.isViral && (
                    <button 
                      onClick={() => handleMakeViral(content.id)}
                      className="w-full py-2 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-lg font-semibold hover:opacity-90 mb-4"
                    >
                      Make Viral
                    </button>
                  )}

                  {content.supportersList.length > 0 && (
                    <div className="mt-4 pt-4 border-t border-gray-800">
                      <p className="text-sm font-medium mb-2 text-gray-400">Supporter Addresses</p>
                      <ul className="text-xs font-mono text-gray-500 space-y-1 max-h-24 overflow-y-auto">
                        {content.supportersList.map((addr, idx) => (
                          <li key={idx} className="truncate">{idx + 1}. {addr}</li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>

      </div>
    </div>
  );
}
