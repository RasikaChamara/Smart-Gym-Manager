import { createContext, useContext, useState, useEffect } from 'react';
import supabase from '../lib/supabaseClient';

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser]   = useState(null);
  const [role, setRole]   = useState(null);
  const [loading, setLoading] = useState(true);

  /* ----------------– helpers –---------------- */
  const fetchRole = async (userId) => {
    const { data, error } = await supabase
      .from('role_claims')
      .select('role')
      .eq('user_id', userId)
      .single();

    setRole(!error && data ? data.role : null);
  };

  /* ----------------– bootstrap –---------------- */
  useEffect(() => {
    let authSub;  // will hold the onAuthStateChange subscription

    const init = async () => {
      // Get current session (no unused var)
      const { data: { session } } = await supabase.auth.getSession();

      if (session?.user) {
        setUser(session.user);
        await fetchRole(session.user.id);
      }
      setLoading(false);

      // Listen for future login / logout events
      authSub = supabase.auth
        .onAuthStateChange((_event, newSession) => {
          if (newSession?.user) {
            setUser(newSession.user);
            fetchRole(newSession.user.id);
          } else {
            setUser(null);
            setRole(null);
          }
        })
        .data.subscription;
    };

    init();

    return () => authSub?.unsubscribe();
  }, []);

  return (
    <AuthContext.Provider value={{ user, role, loading }}>
      {children}
    </AuthContext.Provider>
  );
}

/* eslint-disable react-refresh/only-export-components */
export const useAuth = () => useContext(AuthContext);
