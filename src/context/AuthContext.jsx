import { apiUrl } from '../api';
import React, { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext();

export const ALLOWED_DOMAIN = 'xperience1st.com';

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  // Restore authenticated session from localStorage
  useEffect(() => {
    const savedToken = localStorage.getItem('xperience_portal_token');
    const savedUser = localStorage.getItem('xperience_portal_user');

    if (savedToken && savedUser) {
      try {
        const parsedUser = JSON.parse(savedUser);
        setToken(savedToken);
        setUser(parsedUser);
      } catch (e) {
        localStorage.removeItem('xperience_portal_token');
        localStorage.removeItem('xperience_portal_user');
    window.dispatchEvent(new CustomEvent('xperience_auth_changed'));
      }
    }
    setIsLoading(false);
  }, []);

  const saveAuthSession = (authToken, authUser) => {
    setToken(authToken);
    setUser(authUser);
    setError(null);
    localStorage.setItem('xperience_portal_token', authToken);
    localStorage.setItem('xperience_portal_user', JSON.stringify(authUser));
    window.dispatchEvent(new CustomEvent('xperience_auth_changed'));
  };

  // Google Workspace SSO Login
  const loginWithGoogle = async (credential) => {
    setIsLoading(true);
    setError(null);
    try {
      const res = await fetch(apiUrl('/api/auth/google'), {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ credential })
      });
      const data = await res.json();
      if (res.ok && data.success) {
        saveAuthSession(data.token, data.user);
        return { success: true };
      } else {
        const msg = data.error || `Access denied. Only verified @${ALLOWED_DOMAIN} Google accounts are allowed.`;
        setError(msg);
        return { success: false, error: msg };
      }
    } catch (err) {
      const msg = 'Error connecting to Google authentication service. Please try again.';
      setError(msg);
      return { success: false, error: msg };
    } finally {
      setIsLoading(false);
    }
  };

  const loginAsPreview = (previewUser) => {
    const userToLogin = previewUser || {
      name: 'Waleed Sharawy',
      email: 'waleed@xperience1st.com',
      department: 'Executive & Finance',
      role: 'CEO & Finance',
      picture: 'https://i.ibb.co/60S1MC3p/image.jpg'
    };
    saveAuthSession('local_preview_token', userToLogin);
    return { success: true };
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    setError(null);
    localStorage.removeItem('xperience_portal_token');
    localStorage.removeItem('xperience_portal_user');
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        isAuthenticated: !!user && !!token,
        isLoading,
        error,
        setError,
        loginWithGoogle,
        loginAsPreview,
        logout,
        allowedDomain: ALLOWED_DOMAIN
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
