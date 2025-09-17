import { useState, useEffect, createContext, useContext } from "react";
import { supabase } from "@/integrations/supabase/client";
import { cookieUtils } from "@/lib/utils";
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

  const fetchUserRole = async (userId: string, userEmail: string) => {
    try {
      console.log('Fetching role for user ID:', userId, 'Email:', userEmail);
      
      // Check if this is the admin email
      const isAdminEmail = userEmail === 'abdulkalam081998@gmail.com';
      
      const { data, error } = await supabase
        .from('profiles')
        .select('role')
        .eq('user_id', userId)
        .single();
      
      if (error) {
        console.error('Error fetching user role:', error);
        
        // If profile doesn't exist, create it
        if (error.code === 'PGRST116') { // No rows returned
          console.log('Profile not found, creating new profile...');
          
          const newRole = isAdminEmail ? 'admin' : 'user';
          
          const { data: newProfile, error: createError } = await supabase
            .from('profiles')
            .insert([
              {
                user_id: userId,
                email: userEmail,
                role: newRole
              }
            ])
            .select('role')
            .single();
          
          if (createError) {
            console.error('Error creating profile:', createError);
            return isAdminEmail ? 'admin' : 'user'; // Fallback to email-based role
          }
          
          console.log('Profile created with role:', newProfile.role);
          return newProfile.role;
        }
        
        // Return role based on email for other errors
        return isAdminEmail ? 'admin' : 'user';
      }
      
      // If profile exists but role doesn't match email, update it
      const expectedRole = isAdminEmail ? 'admin' : 'user';
      if (data?.role !== expectedRole && isAdminEmail) {
        console.log('Updating profile role to admin for admin email...');
        
        const { data: updatedProfile, error: updateError } = await supabase
          .from('profiles')
          .update({ role: 'admin' })
          .eq('user_id', userId)
          .select('role')
          .single();
        
        if (updateError) {
          console.error('Error updating profile role:', updateError);
          return 'admin'; // Fallback for admin email
        }
        
        console.log('Profile role updated to:', updatedProfile.role);
        return updatedProfile.role;
      }
      
      const role = data?.role || (isAdminEmail ? 'admin' : 'user');
      console.log('Fetched user role:', role);
      return role;
    } catch (error) {
      console.error('Exception in fetchUserRole:', error);
      // Return admin for admin email, user for others
      return userEmail === 'abdulkalam081998@gmail.com' ? 'admin' : 'user';
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
            console.log('User found, fetching role...');
            // Fetch the actual user role from the database
            fetchUserRole(session.user.id, session.user.email || '').then(role => {
              setUserRole(role);
              console.log('User role set to:', role);
            });
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
        
        if (mounted) {
          setSession(session);
          setUser(session?.user ?? null);
          
          if (session?.user) {
            console.log('Auth state changed - fetching user role...');
            // Fetch the actual user role from the database
            fetchUserRole(session.user.id, session.user.email || '').then(role => {
              setUserRole(role);
              console.log('User role set to:', role);
            });
          } else {
            setUserRole(null);
          }
          
          // Only set loading to false if this is not during initial setup
          if (authResolved) {
            console.log('Auth state change processed - user signed in/out');
          } else {
            setLoading(false);
            authResolved = true;
            clearTimeout(fallbackTimeout);
            console.log('Auth state change processed - initial setup complete');
          }
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
      
      console.log('Starting comprehensive sign out process...');
      
      // Clear Supabase auth first
      const { error } = await supabase.auth.signOut();
      if (error) {
        console.error('Supabase sign out error:', error);
      }
      
      // Use comprehensive cleanup utility
      cookieUtils.clearAllAuthData();
      
      // Clear state immediately
      setUser(null);
      setSession(null);
      setUserRole(null);
      
      console.log('Sign out completed successfully');
    } catch (error) {
      console.error('Sign out error:', error);
      
      // Force cleanup even on error
      cookieUtils.clearAllAuthData();
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
