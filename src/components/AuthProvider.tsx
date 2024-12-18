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

    // Get initial session
    supabase.auth.getSession().then(async ({ data: { session: initialSession } }) => {
      console.log("Initial session:", initialSession);
      
      if (initialSession?.user) {
        const role = await fetchUserRole(initialSession.user.id);
        setSession(initialSession);
        setUserRole(role);
      }
      setIsLoading(false);
    });

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, currentSession) => {
        console.log("Auth state changed:", event, currentSession);

        if (currentSession?.user) {
          const role = await fetchUserRole(currentSession.user.id);
          setSession(currentSession);
          setUserRole(role);
        } else {
          setSession(null);
          setUserRole(null);
        }
      }
    );

    return () => {
      console.log("AuthProvider unmounting");
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