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

  const fetchUserRole = async (userId: string) => {
    try {
      console.log('Fetching role for user ID:', userId);
      const { data, error } = await supabase
        .from('profiles')
        .select('role')
        .eq('user_id', userId)
        .single();
      
      if (error) {
        console.error('Error fetching user role:', error);
        // Return default role instead of throwing
        return 'user';
      }
      
      const role = data?.role || 'user';
      console.log('Fetched user role:', role);
      return role;
    } catch (error) {
      console.error('Exception in fetchUserRole:', error);
      // Return default role on any error
      return 'user';
    }
  };

  useEffect(() => {
    console.log('Setting up auth...');
    let mounted = true;
    let authResolved = false;
    
    // Aggressive fallback - force loading to false after 2 seconds
    const fallbackTimeout = setTimeout(() => {
      if (mounted && !authResolved) {
        console.log('Auth fallback: forcing loading to false after timeout');
        setLoading(false);
        authResolved = true;
      }
    }, 2000);
    
    // Get initial session with timeout
    const getInitialSession = async () => {
      try {
        console.log('Getting initial session...');
        
        // Add a timeout to the getSession call
        const sessionPromise = supabase.auth.getSession();
        const timeoutPromise = new Promise((_, reject) => 
          setTimeout(() => reject(new Error('Session timeout')), 3000)
        );
        
        const { data: { session }, error } = await Promise.race([
          sessionPromise,
          timeoutPromise
        ]) as any;
        
        if (error) {
          console.error('Error getting session:', error);
        }
        
        console.log('Initial session result:', {
          hasSession: !!session,
          hasUser: !!session?.user,
          email: session?.user?.email
        });
        
        if (mounted && !authResolved) {
          setSession(session);
          setUser(session?.user ?? null);
          
          if (session?.user) {
            console.log('User found, setting role to user by default');
            setUserRole('user'); // Skip role fetch for now to prevent delays
          } else {
            setUserRole(null);
            console.log('No user found, role set to null');
          }
          
          setLoading(false);
          authResolved = true;
          clearTimeout(fallbackTimeout);
          console.log('Auth setup complete - user authenticated:', !!session?.user);
        }
      } catch (error) {
        console.error('Error in getInitialSession:', error);
        if (mounted && !authResolved) {
          setSession(null);
          setUser(null);
          setUserRole(null);
          setLoading(false);
          authResolved = true;
          clearTimeout(fallbackTimeout);
          console.log('Auth setup complete with errors - no user');
        }
      }
    };

    // Listen for auth changes - simplified
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        console.log('Auth state changed:', event, {
          hasSession: !!session,
          hasUser: !!session?.user,
          email: session?.user?.email
        });
        
        if (mounted && !authResolved) {
          setSession(session);
          setUser(session?.user ?? null);
          setUserRole(session?.user ? 'user' : null); // Simplified role assignment
          setLoading(false);
          authResolved = true;
          clearTimeout(fallbackTimeout);
          console.log('Auth state change processed');
        }
      }
    );

    // Start the auth check
    getInitialSession();

    return () => {
      mounted = false;
      authResolved = true;
      clearTimeout(fallbackTimeout);
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
