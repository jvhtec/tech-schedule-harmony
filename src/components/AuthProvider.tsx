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
      try {
        console.log("Fetching user role for:", userId);
        const { data, error } = await supabase
          .from('profiles')
          .select('role')
          .eq('id', userId)
          .single();

        if (error) throw error;
        console.log("User role fetched:", data?.role);
        return data?.role || null;
      } catch (error) {
        console.error("Error fetching user role:", error);
        return null;
      }
    };

    const setupAuth = async () => {
      try {
        const { data: { session: initialSession } } = await supabase.auth.getSession();
        console.log("Initial session:", initialSession);

        if (mounted) {
          if (initialSession?.user) {
            const role = await fetchUserRole(initialSession.user.id);
            setSession(initialSession);
            setUserRole(role);
          }
          setIsLoading(false);
        }
      } catch (error) {
        console.error("Error in setupAuth:", error);
        if (mounted) {
          setIsLoading(false);
        }
      }
    };

    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, currentSession) => {
        console.log("Auth state changed:", event, currentSession);

        if (mounted) {
          if (currentSession?.user) {
            const role = await fetchUserRole(currentSession.user.id);
            setSession(currentSession);
            setUserRole(role);
          } else {
            setSession(null);
            setUserRole(null);
          }
        }
      }
    );

    setupAuth();

    return () => {
      console.log("AuthProvider unmounting");
      mounted = false;
      subscription.unsubscribe();
    };
  }, []);

  console.log("AuthProvider state:", { session, userRole, isLoading });

  return (
    <AuthContext.Provider value={{ session, userRole, isLoading }}>
      {children}
    </AuthContext.Provider>
  );
};