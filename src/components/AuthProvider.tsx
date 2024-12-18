import { createContext, useContext, useEffect, useState } from "react";
import { Session } from "@supabase/supabase-js";
import { supabase } from "@/integrations/supabase/client";

interface AuthContextType {
  session: Session | null;
  userRole: string | null;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType>({
  session: null,
  userRole: null,
  isLoading: true,
});

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [session, setSession] = useState<Session | null>(null);
  const [userRole, setUserRole] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    console.log("AuthProvider mounted");

    const fetchUserRole = async (userId: string) => {
      try {
        console.log("Fetching user role for:", userId);
        const { data, error } = await supabase
          .from('profiles')
          .select('role')
          .eq('id', userId)
          .single();

        if (error) {
          console.error("Error fetching user role:", error);
          setUserRole(null);
          return;
        }

        console.log("User role fetched:", data?.role);
        setUserRole(data?.role || null);
      } catch (error) {
        console.error("Error in fetchUserRole:", error);
        setUserRole(null);
      }
    };

    const setupAuth = async () => {
      try {
        // Get initial session
        const { data: { session: initialSession } } = await supabase.auth.getSession();
        console.log("Initial session:", initialSession);
        
        setSession(initialSession);

        if (initialSession?.user) {
          await fetchUserRole(initialSession.user.id);
        }
      } catch (error) {
        console.error("Error in setupAuth:", error);
      } finally {
        setIsLoading(false);
      }
    };

    // Set up auth state change listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, currentSession) => {
      console.log("Auth state changed:", event, currentSession);
      
      setSession(currentSession);
      
      if (currentSession?.user) {
        await fetchUserRole(currentSession.user.id);
      } else {
        setUserRole(null);
      }
      
      setIsLoading(false);
    });

    // Initialize auth
    setupAuth();

    // Cleanup
    return () => {
      console.log("AuthProvider unmounting");
      subscription.unsubscribe();
    };
  }, []);

  console.log("AuthProvider rendering with:", { session, userRole, isLoading });

  return (
    <AuthContext.Provider value={{ session, userRole, isLoading }}>
      {children}
    </AuthContext.Provider>
  );
};