import { createContext, useContext, useState } from 'react';
import API from '../api/axios.js';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    const token = localStorage.getItem('token');
    if (token) {
      try {
        const payload = JSON.parse(atob(token.split('.')[1]));
        API.defaults.headers.common['Authorization'] = `Bearer ${token}`;
        return {
          email: payload.sub || payload.email || localStorage.getItem('email'),
          role: payload['http://schemas.microsoft.com/ws/2008/06/identity/claims/role'] || payload.role || localStorage.getItem('role'),
        };
      } catch {
        localStorage.removeItem('token');
        localStorage.removeItem('role');
        localStorage.removeItem('email');
        delete API.defaults.headers.common['Authorization'];
      }
    }
    return null;
  });

  const login = (dataInput) => {
    let token = dataInput;
    let userRole = null;
    let userEmail = null;

    if (typeof dataInput === 'object' && dataInput !== null) {
      token = dataInput.token || dataInput.accessToken || dataInput.jwt;
      userRole = dataInput.role;
      userEmail = dataInput.email;
    }

    if (typeof token !== 'string') {
      console.error('Invalid token format received:', dataInput);
      return;
    }

    localStorage.setItem('token', token);
    API.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    
    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      
      const finalRole = userRole || payload['http://schemas.microsoft.com/ws/2008/06/identity/claims/role'] || payload.role || 'Reader';
      const finalEmail = userEmail || payload.sub || payload.email || '';

      if (finalRole) localStorage.setItem('role', finalRole);
      if (finalEmail) localStorage.setItem('email', finalEmail);

      setUser({
        email: finalEmail,
        role: finalRole,
      });
    } catch {
      setUser({
        email: userEmail || '',
        role: userRole || 'Reader',
      });
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('role');
    localStorage.removeItem('email');
    delete API.defaults.headers.common['Authorization'];
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);

export default AuthContext;