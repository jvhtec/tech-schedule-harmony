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
        return null;
      }

      console.log("User role fetched:", data?.role);
      return data?.role || null;
    } catch (error) {
      console.error("Error in fetchUserRole:", error);
      return null;
    }
  };

  useEffect(() => {
    let mounted = true;
    console.log("AuthProvider mounted");

    const setupAuth = async () => {
      try {
        const { data: { session: initialSession } } = await supabase.auth.getSession();
        console.log("Initial session:", initialSession);

        if (!mounted) return;

        if (initialSession?.user) {
          const role = await fetchUserRole(initialSession.user.id);
          if (mounted) {
            setSession(initialSession);
            setUserRole(role);
          }
        } else {
          if (mounted) {
            setSession(null);
            setUserRole(null);
          }
        }
      } catch (error) {
        console.error("Error in setupAuth:", error);
      } finally {
        if (mounted) {
          setIsLoading(false);
        }
      }
    };

    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, currentSession) => {
      console.log("Auth state changed:", event, currentSession);

      if (!mounted) return;

      try {
        if (currentSession?.user) {
          const role = await fetchUserRole(currentSession.user.id);
          if (mounted) {
            setSession(currentSession);
            setUserRole(role);
          }
        } else {
          if (mounted) {
            setSession(null);
            setUserRole(null);
          }
        }
      } catch (error) {
        console.error("Error in auth state change handler:", error);
      }
    });

    setupAuth();

    return () => {
      console.log("AuthProvider unmounting");
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