import React, { createContext, useContext, useState, useEffect } from 'react';
import Cookies from "js-cookie"; // Cookies importu

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [isAuthenticated, setIsAuthenticated] = useState(
    () => JSON.parse(localStorage.getItem('isAuthenticated')) || false
  );

  useEffect(() => {
    localStorage.setItem('isAuthenticated', JSON.stringify(isAuthenticated));
  }, [isAuthenticated]);

  const logout = () => {
    setIsAuthenticated(false); // Auth durumunu sıfırla
    localStorage.removeItem('isAuthenticated'); // localStorage'dan veriyi sil
    Cookies.remove('AUTH'); // AUTH cookie'yi temizle
    Cookies.remove('USER'); // USER cookie'yi temizle (varsa)
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, setIsAuthenticated, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
