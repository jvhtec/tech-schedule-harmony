import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Auth as SupabaseAuth } from "@supabase/auth-ui-react";
import { ThemeSupa } from "@supabase/auth-ui-shared";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card } from "@/components/ui/card";
import { Department } from "@/types/department";

const Auth = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isSignUp, setIsSignUp] = useState(false);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    name: "",
    phone: "",
    department: "sound" as Department,
    dni: "",
    residencia: "",
  });

  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      console.log("Auth state changed:", event, session);
      if (event === "SIGNED_IN") {
        toast({
          title: "Welcome!",
          description: "You have successfully signed in.",
        });
        navigate("/dashboard");
      }
    });

    return () => subscription.unsubscribe();
  }, [navigate, toast]);

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      // First, create the auth user
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email: formData.email,
        password: formData.password,
      });

      if (authError) throw authError;

      if (authData.user) {
        // Then, create the technician record
        const { error: techError } = await supabase.from("technicians").insert({
          id: authData.user.id,
          name: formData.name,
          email: formData.email,
          phone: formData.phone,
          department: formData.department,
          dni: formData.dni,
          residencia: formData.residencia,
        });

        if (techError) throw techError;

        toast({
          title: "Account created!",
          description: "Please check your email to verify your account.",
        });
      }
    } catch (error) {
      console.error("Error during signup:", error);
      toast({
        title: "Error",
        description: "There was an error creating your account. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  if (isSignUp) {
    return (
      <div className="container max-w-lg mx-auto py-8">
        <h1 className="text-4xl font-bold text-center mb-8">Sign Up</h1>
        <Card className="p-6">
          <form onSubmit={handleSignUp} className="space-y-4">
            <div>
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                required
              />
            </div>
            <div>
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                required
              />
            </div>
            <div>
              <Label htmlFor="name">Full Name</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                required
              />
            </div>
            <div>
              <Label htmlFor="phone">Phone Number</Label>
              <Input
                id="phone"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
              />
            </div>
            <div>
              <Label htmlFor="department">Department</Label>
              <Select
                value={formData.department}
                onValueChange={(value) => setFormData({ ...formData, department: value })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select department" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="sound">Sound</SelectItem>
                  <SelectItem value="lights">Lights</SelectItem>
                  <SelectItem value="video">Video</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="dni">DNI</Label>
              <Input
                id="dni"
                value={formData.dni}
                onChange={(e) => setFormData({ ...formData, dni: e.target.value })}
              />
            </div>
            <div>
              <Label htmlFor="residencia">Residencia</Label>
              <Input
                id="residencia"
                value={formData.residencia}
                onChange={(e) => setFormData({ ...formData, residencia: e.target.value })}
              />
            </div>
            <div className="flex gap-4">
              <Button type="submit" className="w-full" disabled={loading}>
                {loading ? "Creating account..." : "Sign Up"}
              </Button>
              <Button type="button" variant="outline" onClick={() => setIsSignUp(false)} className="w-full">
                Back to Login
              </Button>
            </div>
          </form>
        </Card>
      </div>
    );
  }

  return (
    <div className="container max-w-lg mx-auto py-8">
      <h1 className="text-4xl font-bold text-center mb-8">Welcome</h1>
      <Card className="p-6">
        <SupabaseAuth
          supabaseClient={supabase}
          appearance={{
            theme: ThemeSupa,
            variables: {
              default: {
                colors: {
                  brand: 'rgb(var(--color-primary))',
                  brandAccent: 'rgb(var(--color-primary))',
                },
              },
            },
          }}
          providers={[]}
          redirectTo={window.location.origin}
          view="sign_in"
        />
        <div className="mt-4 text-center">
          <Button variant="link" onClick={() => setIsSignUp(true)}>
            Don't have an account? Sign up here
          </Button>
        </div>
      </Card>
    </div>
  );
};

export default Auth;