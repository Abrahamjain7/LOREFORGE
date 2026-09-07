import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Gamepad2, LogOut, User, ShieldAlert, PlusCircle } from 'lucide-react';
import { useAuth } from '../Context/AuthContext';

export default function Navbar({ onOpenAuth, onOpenSubmit }) {
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  const handleLogout = () => {
    if (logout) logout();
    navigate('/');
  };

  return (
    <nav className="bg-slate-900/80 backdrop-blur-md border-b border-slate-800 sticky top-0 z-50 px-6 py-4 flex items-center justify-between">
      <div 
        className="flex items-center gap-3 cursor-pointer" 
        onClick={() => navigate('/')}
      >
        <div className="p-2 bg-indigo-600 rounded-lg shadow-lg shadow-indigo-500/30">
          <Gamepad2 className="w-6 h-6 text-white" />
        </div>
        <span className="text-xl font-bold bg-gradient-to-r from-white via-slate-200 to-indigo-400 bg-clip-text text-transparent">
          LoreForge
        </span>
      </div>

      <div className="flex items-center gap-4">
        {user ? (
          <>
            {user.role === 'Admin' && (
              <button
                onClick={() => navigate('/admin')}
                className="flex items-center gap-2 bg-slate-800 hover:bg-slate-700 text-indigo-400 border border-indigo-500/30 px-3 py-2 rounded-lg text-sm font-medium transition"
              >
                <ShieldAlert className="w-4 h-4 text-indigo-400" />
                Admin Panel
              </button>
            )}

            {(user.role === 'Contributor' || user.role === 'Admin') && (
              <button
                onClick={onOpenSubmit}
                className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-500 text-white px-4 py-2 rounded-lg text-sm font-medium transition"
              >
                <PlusCircle className="w-4 h-4" />
                New Guide
              </button>
            )}

            <div className="flex items-center gap-3 bg-slate-800 border border-slate-700/60 rounded-lg px-3 py-1.5">
              <User className="w-4 h-4 text-indigo-400" />
              <div className="text-sm">
                <span className="font-semibold text-slate-200">
                  {user.username || user.email?.split('@')[0] || 'User'}
                </span>
                <span className="ml-2 text-xs px-2 py-0.5 rounded bg-indigo-950 text-indigo-300 border border-indigo-800">
                  {user.role || 'User'}
                </span>
              </div>
            </div>

            <button
              onClick={handleLogout}
              className="p-2 text-slate-400 hover:text-red-400 hover:bg-slate-800 rounded-lg transition"
              title="Logout"
            >
              <LogOut className="w-5 h-5" />
            </button>
          </>
        ) : (
          <button
            onClick={onOpenAuth}
            className="bg-indigo-600 hover:bg-indigo-500 text-white px-4 py-2 rounded-lg text-sm font-medium transition"
          >
            Sign In / Register
          </button>
        )}
      </div>
    </nav>
  );
}