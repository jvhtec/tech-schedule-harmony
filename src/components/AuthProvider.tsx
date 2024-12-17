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
    
    // Get initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      console.log("Initial session check:", session);
      setSession(session);
      if (session) {
        fetchUserRole(session.user.id);
      } else {
        setIsLoading(false);
      }
    });

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      console.log("Auth state changed:", event, session);
      setSession(session);
      
      if (session) {
        fetchUserRole(session.user.id);
      } else {
        setUserRole(null);
        setIsLoading(false);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  const fetchUserRole = async (userId: string) => {
    try {
      console.log("Fetching user role for:", userId);
      const { data, error } = await supabase
        .from("profiles")
        .select("role")
        .eq("id", userId)
        .single();

      if (error) throw error;
      
      console.log("User role fetched:", data?.role);
      setUserRole(data?.role);
    } catch (error) {
      console.error("Error fetching user role:", error);
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