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

    const fetchUserRole = async (userId: string) => {
      if (!mounted) return;
      
      try {
        console.log("Fetching user role for:", userId);
        const { data, error } = await supabase
          .from('profiles')
          .select('role')
          .eq('id', userId)
          .single();

        if (error) {
          console.error("Error fetching user role:", error);
          if (mounted) {
            setUserRole(null);
            setIsLoading(false);
          }
          return;
        }

        console.log("User role fetched:", data?.role);
        if (mounted) {
          setUserRole(data?.role || null);
          setIsLoading(false);
        }
      } catch (error) {
        console.error("Error in fetchUserRole:", error);
        if (mounted) {
          setUserRole(null);
          setIsLoading(false);
        }
      }
    };

    const initializeAuth = async () => {
      try {
        const { data: { session: initialSession } } = await supabase.auth.getSession();
        console.log("Initial session:", initialSession);
        
        if (!mounted) return;

        setSession(initialSession);
        
        if (initialSession?.user) {
          await fetchUserRole(initialSession.user.id);
        } else {
          setIsLoading(false);
        }
      } catch (error) {
        console.error("Error in initializeAuth:", error);
        if (mounted) {
          setSession(null);
          setUserRole(null);
          setIsLoading(false);
        }
      }
    };

    initializeAuth();

    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, currentSession) => {
      console.log("Auth state changed:", event, currentSession);
      
      if (!mounted) return;

      setSession(currentSession);
      
      if (currentSession?.user) {
        await fetchUserRole(currentSession.user.id);
      } else {
        setUserRole(null);
        setIsLoading(false);
      }
    });

    return () => {
      mounted = false;
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