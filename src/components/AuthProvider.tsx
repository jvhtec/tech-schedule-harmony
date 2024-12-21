import { createContext, useContext, useEffect, useState } from "react";
import { Session } from "@supabase/supabase-js";
import { supabase } from "@/integrations/supabase/client";

interface AuthContextType {
  session: Session | null;
  userRole: string | null;
  isLoading: boolean;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType>({
  session: null,
  userRole: null,
  isLoading: true,
  signOut: async () => {},
});

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [session, setSession] = useState<Session | null>(null);
  const [userRole, setUserRole] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [initialized, setInitialized] = useState(false);

  const fetchUserRole = async (userId: string) => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('role')
        .eq('id', userId)
        .single();

      if (error) throw error;
      return data?.role || null;
    } catch (error) {
      console.error("Error fetching user role:", error);
      return null;
    }
  };

  const signOut = async () => {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
      setSession(null);
      setUserRole(null);
    } catch (error) {
      console.error("Error signing out:", error);
    }
  };

  useEffect(() => {
    let mounted = true;

    const initializeAuth = async () => {
      try {
        // Get the initial session
        const { data: { session: initialSession } } = await supabase.auth.getSession();
        console.log("Initial session:", initialSession);

        if (!mounted) return;

        // Only set session and fetch role if we have a valid session
        if (initialSession?.user) {
          const role = await fetchUserRole(initialSession.user.id);
          setSession(initialSession);
          setUserRole(role);
        } else {
          // Clear session and role if no valid session exists
          setSession(null);
          setUserRole(null);
        }
      } catch (error) {
        console.error("Error initializing auth:", error);
        // On error, ensure we clear the session and role
        setSession(null);
        setUserRole(null);
      } finally {
        if (mounted) {
          setIsLoading(false);
          setInitialized(true);
        }
      }
    };

    initializeAuth();

    // Set up auth state change listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, currentSession) => {
      console.log("Auth state changed:", event, currentSession);
      
      if (!mounted || !initialized) return;

      if (currentSession?.user) {
        try {
          const role = await fetchUserRole(currentSession.user.id);
          setSession(currentSession);
          setUserRole(role);
        } catch (error) {
          console.error("Error handling auth state change:", error);
          setSession(null);
          setUserRole(null);
        }
      } else {
        setSession(null);
        setUserRole(null);
      }
    });

    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
  }, []);

  return (
    <AuthContext.Provider value={{ session, userRole, isLoading, signOut }}>
      {initialized ? children : null}
    </AuthContext.Provider>
  );
};