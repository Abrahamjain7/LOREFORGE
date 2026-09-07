import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './Context/AuthContext';
import Navbar from './Components/Navbar';
import GuideList from './Components/GuideList';
import GuideDetail from './Components/GuideDetail';
import AdminPanel from './Components/AdminPanel';

export default function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="min-h-screen bg-slate-900 text-white font-sans">
          <Navbar />
          <main className="max-w-6xl mx-auto px-6 py-10">
            <Routes>
              <Route path="/" element={<GuideList />} />
              <Route path="/guides/:id" element={<GuideDetail />} />
              <Route path="/admin" element={<AdminPanel />} />
            </Routes>
          </main>
        </div>
      </Router>
    </AuthProvider>
  );
}