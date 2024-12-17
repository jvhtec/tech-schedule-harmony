import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { SignUpForm } from "@/components/auth/SignUpForm";
import { LoginForm } from "@/components/auth/LoginForm";
import { UserInfo } from "@/components/UserInfo";

const Auth = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isSignUp, setIsSignUp] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    console.log("Auth page mounted");
    
    // Check initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      console.log("Auth page - Initial session check:", session);
      if (session) {
        console.log("User is already logged in, redirecting to dashboard");
        navigate("/dashboard", { replace: true });
      }
      setIsLoading(false);
    });

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      console.log("Auth state changed:", event, session);
      if (event === "SIGNED_IN") {
        toast({
          title: "Welcome!",
          description: "You have successfully signed in.",
        });
        navigate("/dashboard", { replace: true });
      }
    });

    return () => subscription.unsubscribe();
  }, [navigate, toast]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col px-4 py-8 md:py-12">
      <div className="container max-w-lg mx-auto flex-1 flex flex-col">
        <div className="flex justify-end mb-4">
          <UserInfo />
        </div>
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold mb-2">Welcome</h1>
          <p className="text-lg text-muted-foreground">to Sector-Pro Tech Area</p>
        </div>
        <Card className="p-6 w-full">
          {isSignUp ? (
            <SignUpForm onBack={() => setIsSignUp(false)} />
          ) : (
            <div className="space-y-4">
              <LoginForm />
              <div className="text-center">
                <Button
                  variant="link"
                  onClick={() => setIsSignUp(true)}
                  className="text-sm"
                >
                  Don't have an account? Sign up
                </Button>
              </div>
            </div>
          )}
        </Card>
      </div>
    </div>
  );
};

export default Auth;