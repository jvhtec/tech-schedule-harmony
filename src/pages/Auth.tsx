import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { SignUpForm } from "@/components/auth/SignUpForm";
import { LoginForm } from "@/components/auth/LoginForm";
import { UserInfo } from "@/components/UserInfo";
import { useAuth } from "@/components/AuthProvider";

const Auth = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isSignUp, setIsSignUp] = useState(false);
  const { session, isLoading } = useAuth();

  useEffect(() => {
    console.log("Auth page - Current session:", session, "isLoading:", isLoading);
    
    if (session) {
      console.log("User is already logged in, redirecting to dashboard");
      navigate("/dashboard", { replace: true });
    }
  }, [session, navigate]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (session) {
    return null;
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