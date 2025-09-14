import { useState, useEffect, createContext, useContext } from "react";
import { supabase } from "@/integrations/supabase/client";
import type { User, Session } from '@supabase/supabase-js';

interface AuthContextType {
  user: User | null;
  session: Session | null;
  userRole: string | null;
  signOut: () => Promise<void>;
  loading: boolean;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  session: null,
  userRole: null,
  signOut: async () => {},
  loading: true,
});

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [userRole, setUserRole] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [initialized, setInitialized] = useState(false);

  const fetchUserRole = async (userId: string) => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('role')
        .eq('user_id', userId)
        .single();
      
      if (error) {
        console.error('Error fetching user role:', error);
        return 'user';
      }
      
      return data?.role || 'user';
    } catch (error) {
      console.error('Error fetching user role:', error);
      return 'user';
    }
  };

  useEffect(() => {
    let isMounted = true;

    const initializeAuth = async () => {
      try {
        // Get initial session
        const { data: { session } } = await supabase.auth.getSession();
        
        if (!isMounted) return;
        
        setSession(session);
        setUser(session?.user ?? null);
        
        if (session?.user) {
          const role = await fetchUserRole(session.user.id);
          if (isMounted) {
            setUserRole(role);
          }
        } else {
          setUserRole(null);
        }
      } catch (error) {
        console.error('Error initializing auth:', error);
        if (isMounted) {
          setUser(null);
          setSession(null);
          setUserRole(null);
        }
      } finally {
        if (isMounted) {
          setLoading(false);
          setInitialized(true);
        }
      }
    };

    // Set up auth state listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        if (!isMounted) return;
        
        console.log('Auth state changed:', event, session?.user?.email);
        
        setSession(session);
        setUser(session?.user ?? null);
        
        if (session?.user) {
          const role = await fetchUserRole(session.user.id);
          if (isMounted) {
            setUserRole(role);
          }
        } else {
          if (isMounted) {
            setUserRole(null);
          }
        }
        
        if (isMounted && initialized) {
          setLoading(false);
        }
      }
    );

    // Initialize auth
    initializeAuth();

    return () => {
      isMounted = false;
      subscription.unsubscribe();
    };
  }, []);

  const signOut = async () => {
    try {
      setLoading(true);
      const { error } = await supabase.auth.signOut();
      if (error) {
        console.error('Sign out error:', error);
      }
      
      // Clear state
      setUser(null);
      setSession(null);
      setUserRole(null);
    } catch (error) {
      console.error('Sign out error:', error);
      // Force clear state even on error
      setUser(null);
      setSession(null);
      setUserRole(null);
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthContext.Provider value={{ user, session, userRole, signOut, loading }}>
      {children}
    </AuthContext.Provider>
  );
};