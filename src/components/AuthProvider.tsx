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
    
    let mounted = true;

    async function getInitialSession() {
      try {
        const { data: { session: initialSession }, error } = await supabase.auth.getSession();
        
        console.log("Initial session check:", initialSession, error);
        
        if (error) {
          console.error("Error getting initial session:", error);
          throw error;
        }

        if (mounted) {
          if (initialSession) {
            setSession(initialSession);
            await fetchUserRole(initialSession.user.id);
          } else {
            setIsLoading(false);
          }
        }
      } catch (error) {
        console.error("Error in getInitialSession:", error);
        if (mounted) {
          setIsLoading(false);
        }
      }
    }

    getInitialSession();

    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, currentSession) => {
      console.log("Auth state changed:", event, currentSession);
      
      if (mounted) {
        setSession(currentSession);
        
        if (currentSession) {
          await fetchUserRole(currentSession.user.id);
        } else {
          setUserRole(null);
          setIsLoading(false);
        }
      }
    });

    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
  }, []);

  const fetchUserRole = async (userId: string) => {
    try {
      console.log("Fetching user role for:", userId);
      const { data, error } = await supabase
        .from("profiles")
        .select("role")
        .eq("id", userId)
        .single();

      if (error) {
        console.error("Error fetching user role:", error);
        throw error;
      }
      
      console.log("User role fetched:", data?.role);
      setUserRole(data?.role);
    } catch (error) {
      console.error("Error in fetchUserRole:", error);
      setUserRole(null);
    } finally {
      setIsLoading(false);
    }
  };

  const value = {
    session,
    userRole,
    isLoading,
  };

  console.log("AuthProvider rendering with:", value);

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};