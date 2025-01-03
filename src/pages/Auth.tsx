import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Loader2, Mail, Lock, User, Phone, MapPin, CreditCard, Building2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";
import { useAuth } from "@/components/AuthProvider";

type Department = "sound" | "lights" | "video";

interface SignUpFormData {
  email: string;
  password: string;
  name: string;
  phone: string;
  department: Department;
  dni: string;
  residencia: string;
}

const Auth = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { session } = useAuth();
  const [showSignUp, setShowSignUp] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  // Redirect if already authenticated
  useEffect(() => {
    if (session) {
      navigate("/dashboard");
    }
  }, [session, navigate]);

  // Login form state
  const [loginData, setLoginData] = useState({
    email: "",
    password: "",
  });

  // Signup form state
  const [signupData, setSignupData] = useState<SignUpFormData>({
    email: "",
    password: "",
    name: "",
    phone: "",
    department: "sound",
    dni: "",
    residencia: "",
  });

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    
    try {
      const email = loginData.email.trim().toLowerCase();
      const password = loginData.password.trim();

      console.log("Attempting login for email:", email);

      const { data, error: signInError } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (signInError) {
        console.error("Login error:", signInError);
        
        if (signInError.message.includes("Invalid login credentials")) {
          throw new Error("Invalid email or password. Please check your credentials and try again.");
        } else if (signInError.message.includes("Email not confirmed")) {
          throw new Error("Please verify your email address before logging in.");
        } else {
          throw new Error(signInError.message || "An error occurred during login. Please try again.");
        }
      }

      if (!data?.user) {
        throw new Error("Login failed. Please try again.");
      }

      console.log("Login successful for user:", data.user.id);
      toast({
        title: "Welcome back!",
        description: "You have successfully logged in.",
      });
      
      navigate("/dashboard");
    } catch (error: any) {
      console.error("Login error:", error);
      setError(error.message);
      toast({
        title: "Login Failed",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    
    try {
      console.log("Starting signup process with email:", signupData.email);

      // First sign up the user with Supabase Auth
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email: signupData.email,
        password: signupData.password,
        options: {
          data: {
            name: signupData.name,
            role: "technician",
          },
        },
      });

      if (authError) {
        console.error("Auth signup error:", authError);
        throw authError;
      }

      if (!authData.user) {
        throw new Error("No user data returned from signup");
      }

      console.log("Auth signup completed, creating technician record");

      // Then create the technician record
      const { error: techError } = await supabase
        .from("technicians")
        .insert({
          id: authData.user.id,
          name: signupData.name,
          email: signupData.email.toLowerCase(),
          phone: signupData.phone || null,
          department: signupData.department,
          dni: signupData.dni || null,
          residencia: signupData.residencia || null,
        });

      if (techError) {
        console.error("Technician creation error:", techError);
        throw techError;
      }

      console.log("Signup completed successfully");
      toast({
        title: "Account created!",
        description: "Please check your email to verify your account.",
      });
      
      setShowSignUp(false);
    } catch (error: any) {
      console.error("Signup error:", error);
      setError(error.message);
      toast({
        title: "Signup Failed",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const renderLoginForm = () => (
    <>
      <form onSubmit={handleLogin} className="space-y-4">
        {error && (
          <Alert variant="destructive">
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}
        <div>
          <Label htmlFor="login-email">Email</Label>
          <div className="relative">
            <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
            <Input
              id="login-email"
              type="email"
              value={loginData.email}
              onChange={(e) => setLoginData(prev => ({ 
                ...prev, 
                email: e.target.value 
              }))}
              required
              disabled={loading}
              placeholder="Enter your email"
              className="pl-10"
            />
          </div>
        </div>
        <div>
          <Label htmlFor="login-password">Password</Label>
          <div className="relative">
            <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
            <Input
              id="login-password"
              type="password"
              value={loginData.password}
              onChange={(e) => setLoginData(prev => ({ 
                ...prev, 
                password: e.target.value 
              }))}
              required
              disabled={loading}
              placeholder="Enter your password"
              className="pl-10"
            />
          </div>
        </div>
        <Button type="submit" className="w-full" disabled={loading}>
          {loading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Logging in...
            </>
          ) : (
            "Log In"
          )}
        </Button>
      </form>
      <div className="mt-4 text-center">
        <Button
          variant="ghost"
          onClick={() => setShowSignUp(true)}
          className="text-primary hover:text-primary/90"
          type="button"
        >
          Crear cuenta
        </Button>
      </div>
    </>
  );

  const renderSignUpForm = () => (
    <form onSubmit={handleSignUp} className="space-y-4">
      {error && (
        <Alert variant="destructive">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}
      <div className="space-y-4">
        <div>
          <Label htmlFor="signup-email">Email</Label>
          <div className="relative">
            <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
            <Input
              id="signup-email"
              type="email"
              value={signupData.email}
              onChange={(e) => setSignupData(prev => ({ 
                ...prev, 
                email: e.target.value 
              }))}
              className="pl-10"
              placeholder="Enter your email"
              required
              disabled={loading}
            />
          </div>
        </div>
        
        <div>
          <Label htmlFor="signup-password">Password</Label>
          <div className="relative">
            <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
            <Input
              id="signup-password"
              type="password"
              value={signupData.password}
              onChange={(e) => setSignupData(prev => ({ 
                ...prev, 
                password: e.target.value 
              }))}
              className="pl-10"
              placeholder="Create a password"
              required
              disabled={loading}
              minLength={6}
            />
          </div>
        </div>

        <div>
          <Label htmlFor="name">Full Name</Label>
          <div className="relative">
            <User className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
            <Input
              id="name"
              type="text"
              value={signupData.name}
              onChange={(e) => setSignupData(prev => ({ 
                ...prev, 
                name: e.target.value 
              }))}
              className="pl-10"
              placeholder="Enter your full name"
              required
              disabled={loading}
            />
          </div>
        </div>

        <div>
          <Label htmlFor="phone">Phone</Label>
          <div className="relative">
            <Phone className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
            <Input
              id="phone"
              type="tel"
              value={signupData.phone}
              onChange={(e) => setSignupData(prev => ({ 
                ...prev, 
                phone: e.target.value 
              }))}
              className="pl-10"
              placeholder="Enter your phone number"
              disabled={loading}
            />
          </div>
        </div>

        <div>
          <Label htmlFor="department">Department</Label>
          <select
            id="department"
            value={signupData.department}
            onChange={(e) => setSignupData(prev => ({ 
              ...prev, 
              department: e.target.value as Department 
            }))}
            className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
            disabled={loading}
          >
            <option value="sound">Sound</option>
            <option value="lights">Lights</option>
            <option value="video">Video</option>
          </select>
        </div>

        <div>
          <Label htmlFor="dni">DNI</Label>
          <div className="relative">
            <CreditCard className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
            <Input
              id="dni"
              type="text"
              value={signupData.dni}
              onChange={(e) => setSignupData(prev => ({ 
                ...prev, 
                dni: e.target.value 
              }))}
              className="pl-10"
              placeholder="Enter your DNI"
              disabled={loading}
            />
          </div>
        </div>

        <div>
          <Label htmlFor="residencia">Residencia</Label>
          <div className="relative">
            <Building2 className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
            <Input
              id="residencia"
              type="text"
              value={signupData.residencia}
              onChange={(e) => setSignupData(prev => ({ 
                ...prev, 
                residencia: e.target.value 
              }))}
              className="pl-10"
              placeholder="Enter your residencia"
              disabled={loading}
            />
          </div>
        </div>
      </div>

      <div className="space-y-2">
        <Button type="submit" className="w-full" disabled={loading}>
          {loading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Creating account...
            </>
          ) : (
            "Create Account"
          )}
        </Button>
        <Button
          type="button"
          variant="outline"
          className="w-full"
          onClick={() => setShowSignUp(false)}
          disabled={loading}
        >
          Back to Login
        </Button>
      </div>
    </form>
  );

  return (
    <div className="min-h-screen flex flex-col px-4 py-8 md:py-12">
      <div className="container max-w-lg mx-auto flex-1 flex flex-col">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold mb-2">Bienvenido</h1>
          <p className="text-lg text-muted-foreground">
            al Area Tecnica Sector-Pro
          </p>
        </div>

        <Card className="p-6 w-full shadow-lg">
          {showSignUp ? renderSignUpForm() : renderLoginForm()}
        </Card>
      </div>
    </div>
  );
};

export default Auth;