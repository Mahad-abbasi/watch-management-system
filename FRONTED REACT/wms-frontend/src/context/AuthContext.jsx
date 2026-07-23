import React, { createContext, useState, useContext, useEffect } from 'react';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Initial Verification Check for Persisted Operational Sessions
    const persistedUser = localStorage.getItem('vera_user');
    if (persistedUser) {
      setUser(JSON.parse(persistedUser));
    }
    setLoading(false);
  }, []);

  const login = async (username, password) => {
    // Simulating Enterprise Master Authorization Layer
    if (username === 'admin' && password === 'admin') {
      const activeUser = { id: 1, name: 'M. Ghufran Abbasi', role: 'Executive Administrator' };
      setUser(activeUser);
      localStorage.setItem('vera_user', JSON.stringify(activeUser));
      localStorage.setItem('vera_token', 'mock-master-jwt-key');
      return true;
    }
    return false;
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('vera_user');
    localStorage.removeItem('vera_token');
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);