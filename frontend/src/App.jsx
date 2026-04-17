import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import { AuthProvider } from './context/AuthContext';
import { Web3Provider } from './context/Web3Context';

import Login from './pages/Login';
import Register from './pages/Register';
import CreatorDashboard from './pages/CreatorDashboard';
import SupporterDashboard from './pages/SupporterDashboard';

function App() {
  return (
    <Router>
      <AuthProvider>
        <Web3Provider>
          <Routes>
            <Route path="/" element={<Navigate to="/login" replace />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/creator-dashboard" element={<CreatorDashboard />} />
            <Route path="/supporter-dashboard" element={<SupporterDashboard />} />
          </Routes>
          <ToastContainer position="bottom-right" theme="dark" />
        </Web3Provider>
      </AuthProvider>
    </Router>
  );
}

export default App;
