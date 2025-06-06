import { createContext, useContext, useEffect, useState } from 'react';
import Notiflix from 'notiflix';

interface AuthContextType {
  isAuthenticated: boolean;
  setIsAuthenticated: React.Dispatch<React.SetStateAction<boolean>>;
}
const API_BASE = import.meta.env.VITE_API_BASE || 'http://localhost:3000/api/v1';
const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);

  useEffect(() => {
    fetch(`${API_BASE}/auth/check`, {credentials: 'include'})
      .then(res => {
        if (res.ok) {
          setIsAuthenticated(true);
        } else {
          if (isAuthenticated) {
            setIsAuthenticated(false);
            Notiflix.Notify.failure('Session expired, please log in again.');
          }
        }
      })
      .catch(error => {
        if (isAuthenticated) setIsAuthenticated(false);
        Notiflix.Notify.failure(`Error checking authentication: ${error instanceof Error ? error.message : 'Unknown error'}`);
      })
  }, [isAuthenticated]);

  return (
    <AuthContext.Provider value={{ isAuthenticated, setIsAuthenticated }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
