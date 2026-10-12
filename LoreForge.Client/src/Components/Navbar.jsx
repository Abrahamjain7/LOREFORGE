import { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { 
  Gamepad2, 
  LogOut, 
  User, 
  ShieldAlert, 
  PlusCircle, 
  BookOpen, 
  Zap, 
  Skull, 
  Feather, 
  Bookmark, 
  Menu, 
  X 
} from 'lucide-react';
import { useAuth } from '../Context/AuthContext';

export default function Navbar({ onOpenAuth, onOpenSubmit }) {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, logout } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleLogout = () => {
    if (logout) logout();
    navigate('/');
  };

  const navLinks = [
    { label: 'Strategy Vault', path: '/', icon: BookOpen },
    { label: 'Build Planner', path: '/planner', icon: Zap },
    { label: 'Boss Codex', path: '/bosses', icon: Skull },
    { label: 'World Lore', path: '/lore', icon: Feather },
    { label: 'Bookmarks', path: '/bookmarks', icon: Bookmark },
  ];

  const isActive = (path) => {
    if (path === '/') return location.pathname === '/';
    return location.pathname.startsWith(path);
  };

  return (
    <nav className="bg-slate-950/85 backdrop-blur-xl border-b border-slate-800/80 sticky top-0 z-50 transition-all duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-8 py-3.5 flex items-center justify-between">
        
        {/* Brand Logo */}
        <div className="flex items-center gap-8">
          <div 
            className="flex items-center gap-3 cursor-pointer group" 
            onClick={() => navigate('/')}
          >
            <div className="p-2.5 bg-gradient-to-br from-indigo-600 to-indigo-800 rounded-xl shadow-lg shadow-indigo-600/30 group-hover:scale-105 transition duration-300">
              <Gamepad2 className="w-5 h-5 text-white" />
            </div>
            <div>
              <span className="text-xl font-bold font-serif bg-gradient-to-r from-white via-indigo-100 to-indigo-400 bg-clip-text text-transparent block">
                LoreForge
              </span>
              <span className="text-[9px] uppercase tracking-widest text-indigo-400 font-mono -mt-1 block">
                Tactical Gaming Vault
              </span>
            </div>
          </div>

          {/* Desktop Nav Links */}
          <div className="hidden lg:flex items-center gap-1 bg-slate-900/60 p-1 rounded-xl border border-slate-800/80">
            {navLinks.map((link) => {
              const Icon = link.icon;
              const active = isActive(link.path);
              return (
                <button
                  key={link.path}
                  onClick={() => navigate(link.path)}
                  className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-serif transition-all duration-200 cursor-pointer ${
                    active
                      ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/20'
                      : 'text-slate-400 hover:text-slate-100 hover:bg-slate-800/50'
                  }`}
                >
                  <Icon className={`w-3.5 h-3.5 ${active ? 'text-white' : 'text-slate-400'}`} />
                  <span>{link.label}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-3">
          {user ? (
            <>
              {user.role === 'Admin' && (
                <button
                  onClick={() => navigate('/admin')}
                  className="hidden sm:flex items-center gap-1.5 bg-rose-950/40 hover:bg-rose-900/50 text-rose-300 border border-rose-500/40 px-3 py-1.5 rounded-xl text-xs font-serif transition cursor-pointer"
                >
                  <ShieldAlert className="w-3.5 h-3.5 text-rose-400" />
                  Admin
                </button>
              )}

              {(user.role === 'Admin' || user.role === 'Contributor') && (
                <button
                  onClick={onOpenSubmit}
                  className="hidden sm:flex items-center gap-1.5 bg-indigo-600 hover:bg-indigo-500 text-white px-3.5 py-1.5 rounded-xl text-xs font-serif transition shadow-lg shadow-indigo-600/20 cursor-pointer"
                >
                  <PlusCircle className="w-3.5 h-3.5" />
                  Forge Guide
                </button>
              )}

              <div className="flex items-center gap-2.5 bg-slate-900/80 border border-slate-800 rounded-xl px-3 py-1.5">
                <User className="w-3.5 h-3.5 text-indigo-400" />
                <div className="text-xs">
                  <span className="font-semibold text-slate-200 font-serif">
                    {user.username || user.email?.split('@')[0] || 'Tarnished'}
                  </span>
                  <span className="ml-1.5 text-[9px] font-mono px-1.5 py-0.5 rounded bg-indigo-950 text-indigo-300 border border-indigo-800">
                    {user.role || 'Member'}
                  </span>
                </div>
              </div>

              <button
                onClick={handleLogout}
                className="p-2 text-slate-400 hover:text-rose-400 hover:bg-slate-900 rounded-xl transition cursor-pointer"
                title="Logout"
              >
                <LogOut className="w-4 h-4" />
              </button>
            </>
          ) : (
            <button
              onClick={onOpenAuth}
              className="bg-indigo-600 hover:bg-indigo-500 text-white px-4 py-2 rounded-xl text-xs font-serif transition shadow-lg shadow-indigo-600/25 cursor-pointer"
            >
              Sign In / Register
            </button>
          )}

          {/* Mobile Hamburger Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="lg:hidden p-2 text-slate-400 hover:text-white rounded-xl hover:bg-slate-900 transition cursor-pointer"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-slate-950 border-b border-slate-800 px-6 py-4 space-y-3">
          <div className="grid grid-cols-2 gap-2">
            {navLinks.map((link) => {
              const Icon = link.icon;
              const active = isActive(link.path);
              return (
                <button
                  key={link.path}
                  onClick={() => {
                    navigate(link.path);
                    setMobileMenuOpen(false);
                  }}
                  className={`flex items-center gap-2 p-2.5 rounded-xl text-xs font-serif transition cursor-pointer ${
                    active
                      ? 'bg-indigo-600 text-white'
                      : 'text-slate-300 bg-slate-900/60 border border-slate-800'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span>{link.label}</span>
                </button>
              );
            })}
          </div>

          {user && (
            <div className="pt-2 border-t border-slate-800 flex gap-2">
              {(user.role === 'Admin' || user.role === 'Contributor') && (
                <button
                  onClick={() => {
                    onOpenSubmit();
                    setMobileMenuOpen(false);
                  }}
                  className="flex-1 bg-indigo-600 hover:bg-indigo-500 text-white py-2 rounded-xl text-xs font-serif flex items-center justify-center gap-2"
                >
                  <PlusCircle className="w-4 h-4" /> Forge Guide
                </button>
              )}
              {user.role === 'Admin' && (
                <button
                  onClick={() => {
                    navigate('/admin');
                    setMobileMenuOpen(false);
                  }}
                  className="bg-rose-950/60 text-rose-300 border border-rose-500/40 px-3 py-2 rounded-xl text-xs font-serif"
                >
                  Admin
                </button>
              )}
            </div>
          )}
        </div>
      )}
    </nav>
  );
}