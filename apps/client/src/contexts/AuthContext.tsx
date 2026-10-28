import { createContext, useContext, useState } from 'react';

const AuthContext = createContext({});

export const AuthProvider = ({ children }: any) => {
  // Replace this with actual auth logic (tokens, API check, etc.)
  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem('token');
    return saved ? { name: 'Demo User', token: saved } : null;
  });

  const login = (userData: any, token: any) => {
    localStorage.setItem('token', token);
    setUser(userData);
  };

  const logout = () => {
    localStorage.removeItem('token');
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, isAuthenticated: !!user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);