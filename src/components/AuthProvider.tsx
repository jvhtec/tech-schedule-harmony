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
    console.log("Starting sign out process");
    
    try {
      // First clear local state
      setSession(null);
      setUserRole(null);
      
      // Clear Supabase-related items from localStorage
      Object.keys(localStorage).forEach(key => {
        if (key.startsWith('supabase.auth.')) {
          localStorage.removeItem(key);
        }
      });

      // Then attempt to sign out from Supabase
      const { error } = await supabase.auth.signOut();
      if (error) {
        console.error("Supabase signOut error:", error);
      }
    } catch (error) {
      console.error("Error during signOut:", error);
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

        if (initialSession?.user) {
          const role = await fetchUserRole(initialSession.user.id);
          setSession(initialSession);
          setUserRole(role);
        } else {
          setSession(null);
          setUserRole(null);
        }
      } catch (error) {
        console.error("Error initializing auth:", error);
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