import React, { createContext, useState, useContext, useEffect } from 'react';
import { supabase } from '@/api/supabaseClient';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoadingAuth, setIsLoadingAuth] = useState(true);
  const [authChecked, setAuthChecked] = useState(false);

  useEffect(() => {
    // Check initial Supabase session on mount
    checkUserAuth();

    // Listen for Supabase auth state changes (login, logout, OAuth callback)
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session) {
        const u = session.user;
        setUser({ ...u, role: u.app_metadata?.role || 'user' });
        setIsAuthenticated(true);
      } else {
        setUser(null);
        setIsAuthenticated(false);
      }
      setAuthChecked(true);
      setIsLoadingAuth(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  const checkUserAuth = async () => {
    try {
      setIsLoadingAuth(true);
      const { data: { session }, error } = await supabase.auth.getSession();
      if (error || !session) {
        setUser(null);
        setIsAuthenticated(false);
      } else {
        const u = session.user;
        setUser({ ...u, role: u.app_metadata?.role || 'user' });
        setIsAuthenticated(true);
      }
    } catch {
      setUser(null);
      setIsAuthenticated(false);
    } finally {
      setIsLoadingAuth(false);
      setAuthChecked(true);
    }
  };

  const logout = async (shouldRedirect = true) => {
    setUser(null);
    setIsAuthenticated(false);
    await supabase.auth.signOut();
    if (shouldRedirect) {
      window.location.href = window.location.href;
    }
  };

  const navigateToLogin = () => {
    window.location.href = `/login?returnTo=${encodeURIComponent(window.location.href)}`;
  };

  return (
    <AuthContext.Provider value={{
      user,
      isAuthenticated,
      isLoadingAuth,
      isLoadingPublicSettings: false, // No longer used; kept for API compatibility
      authError: null,                // No longer used; kept for API compatibility
      appPublicSettings: null,        // No longer used; kept for API compatibility
      authChecked,
      logout,
      navigateToLogin,
      checkUserAuth,
      checkAppState: checkUserAuth,   // Alias for API compatibility
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
