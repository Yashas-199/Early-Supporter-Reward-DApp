import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { toast } from 'react-toastify';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const user = await login(email, password);
      toast.success('Logged in successfully!');
      if (user.role === 'creator') {
        navigate('/creator-dashboard');
      } else {
        navigate('/supporter-dashboard');
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

  return (
    <div className="flex h-screen w-full font-sans bg-[#0f0f10] text-white">
      {/* Left Side: Modern Web3 Feel */}
      <div className="hidden lg:flex w-1/2 p-6 relative">
        <div className="w-full h-full rounded-[40px] flex flex-col justify-center items-center relative overflow-hidden" 
             style={{ 
               backgroundColor: '#1E1E24',
               backgroundImage: `radial-gradient(circle at 50% 50%, rgba(255,255,255,0.05) 1px, transparent 1px), radial-gradient(circle at 100% 100%, rgba(255,255,255,0.05) 1px, transparent 1px)`,
               backgroundSize: '40px 40px',
               boxShadow: 'inset 0 0 100px rgba(0,0,0,0.8)'
             }}>
          
          {/* Faux Background pattern circles to imitate the image */}
          <div className="absolute inset-0 opacity-20 pointer-events-none">
             {[...Array(20)].map((_, i) => (
                <div key={i} className="absolute rounded-full bg-white/10" 
                     style={{ 
                       width: '120px', height: '120px', 
                       top: `${Math.floor(i/4) * 25}%`, left: `${(i%4) * 25}%`,
                       transform: 'translate(-50%, -50%)'
                     }} />
             ))}
          </div>

          <div className="z-10 w-full max-w-[420px] mx-auto grid grid-cols-3 gap-4">
            {/* Row 1 */}
            <div className="rounded-[32px] glass-dark aspect-square border border-white/5"></div>
            <div className="rounded-[32px] bg-gradient-to-br from-[#2a2a2e] to-[#1c1c1f] text-white aspect-square flex flex-col justify-center items-start p-6 shadow-lg border border-white/10">
              <span className="text-sm font-medium mb-1 text-gray-300">Total Care.</span>
              <span className="text-sm font-medium text-gray-400">Total Different.</span>
            </div>
            <div className="rounded-[32px] glass-dark aspect-square border border-white/5"></div>

            {/* Row 2 */}
            <div className="rounded-[32px] bg-[#e5e5e5] text-black aspect-square flex flex-col justify-center items-start p-6 shadow-lg">
              <span className="text-xl mb-4 text-gray-600">+</span>
              <span className="text-sm font-semibold leading-tight">Building trust <br/>in blockchain <br/>technology</span>
            </div>
            <div className="rounded-[32px] bg-gradient-to-br from-[#333] to-[#1a1a1f] text-white aspect-square flex items-center justify-center shadow-lg border border-white/10">
              <div className="bg-[#e5e5e5] text-black w-14 h-14 rounded-2xl flex items-center justify-center font-bold text-3xl italic shadow-inner">S</div>
            </div>
            <div className="rounded-[32px] glass-dark aspect-square border border-white/5"></div>

            {/* Row 3 */}
            <div className="rounded-[32px] glass-dark aspect-square border border-white/5"></div>
            <div className="rounded-[32px] bg-[#2a2a2e] text-white aspect-square flex flex-col justify-center items-start p-6 shadow-lg border border-white/10">
              <span className="text-xl mb-4 text-gray-500">+</span>
              <span className="text-sm font-medium leading-tight text-gray-300">Own <br/>your power</span>
            </div>
            <div className="rounded-[32px] glass-dark aspect-square border border-white/5"></div>
          </div>
        </div>
      </div>
      
      {/* Right Side: Login Form */}
      <div className="w-full lg:w-1/2 flex flex-col items-center justify-center p-8 bg-[#0f0f10]">
        <div className="max-w-[360px] w-full">
          <h1 className="text-[32px] font-medium mb-2">Log In</h1>
          <p className="text-gray-500 mb-8 text-[15px]">Welcome back. Please enter your details.</p>
          
          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <input
                type="email"
                placeholder="Email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-5 py-3.5 rounded-[18px] bg-transparent border border-[#2a2a2e] text-white focus:outline-none focus:border-[#b18fff] transition-colors placeholder-gray-600 text-[15px]"
              />
            </div>
            <div>
              <input
                type="password"
                placeholder="Password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-5 py-3.5 rounded-[18px] bg-transparent border border-[#2a2a2e] text-white focus:outline-none focus:border-[#b18fff] transition-colors placeholder-gray-600 text-[15px]"
              />
            </div>
            
            <div className="pt-2">
              <button 
                type="submit" 
                className="w-full py-3.5 rounded-[18px] bg-white text-black font-semibold hover:bg-gray-200 transition-colors"
              >
                Log In
              </button>
            </div>
          </form>

          <div className="flex items-center justify-center space-x-4 my-6">
            <hr className="w-full border-[#2a2a2e]" />
            <span className="text-gray-600 text-sm">Or</span>
            <hr className="w-full border-[#2a2a2e]" />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <button className="w-full py-3 rounded-[16px] bg-[#1a1a1f] border border-[#2a2a2e] text-sm text-gray-300 font-medium hover:bg-[#25252a] transition-colors">
              Google
            </button>
            <button className="w-full py-3 rounded-[16px] bg-[#1a1a1f] border border-[#2a2a2e] text-sm text-gray-300 font-medium hover:bg-[#25252a] transition-colors">
              Facebook
            </button>
          </div>
          
          <div className="mt-8 text-center text-gray-500 text-sm">
            Don't have an account? <Link to="/register" className="text-white hover:text-gray-300 font-medium ml-1">Sign Up</Link>
          </div>
        </div>
      </div>
    </div>
  );
}
