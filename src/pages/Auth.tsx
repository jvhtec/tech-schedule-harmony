import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Card } from "@/components/ui/card";
import { LoginForm } from "@/components/auth/LoginForm";
import { SignUpForm } from "@/components/auth/SignUpForm";
import { UserInfo } from "@/components/UserInfo";
import { useAuth } from "@/components/AuthProvider";

const Auth = () => {
  const navigate = useNavigate();
  const { session, isLoading } = useAuth();
  const [showSignUp, setShowSignUp] = useState(false);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (session) {
      navigate("/dashboard"); // Redirect on successful login
    } else if (error) {
      console.error("Login error:", error.message);
    }
  };

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
          {showSignUp ? (
            <SignUpForm onBack={() => setShowSignUp(false)} />
          ) : (
            <>
              <LoginForm />
              <div className="mt-4 text-center">
                <button
                  onClick={() => setShowSignUp(true)}
                  className="text-primary hover:underline"
                >
                  Don't have an account? Sign up
                </button>
              </div>
            </>
          )}
        </Card>
      </div>
    </div>
  );
};

export default Auth;
