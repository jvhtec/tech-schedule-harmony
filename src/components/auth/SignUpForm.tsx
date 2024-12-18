import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";
import { Department } from "@/types/department";
import { SignUpFormFields } from "./signup/SignUpFormFields";
import { SignUpFormActions } from "./signup/SignUpFormActions";

interface SignUpFormData {
  email: string;
  password: string;
  name: string;
  phone: string;
  department: Department;
  dni: string;
  residencia: string;
  role: "management" | "logistics" | "technician";
}

export const SignUpForm = ({ onBack }: { onBack: () => void }) => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState<SignUpFormData>({
    email: "",
    password: "",
    name: "",
    phone: "",
    department: "sound",
    dni: "",
    residencia: "",
    role: "technician",
  });

  const handleFormChange = (field: keyof SignUpFormData, value: string | Department) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      console.log("Starting signup process with email:", formData.email);
      
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email: formData.email,
        password: formData.password,
        options: {
          data: {
            name: formData.name,
            department: formData.department,
          },
        },
      });

      if (authError) {
        console.error("Auth error:", authError);
        throw authError;
      }

      if (!authData.user) {
        throw new Error("No user data returned from signup");
      }

      console.log("Auth user created:", authData.user.id);

      const { error: techError } = await supabase.from("technicians").insert({
        id: authData.user.id,
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
        department: formData.department,
        dni: formData.dni,
        residencia: formData.residencia,
      });

      if (techError) {
        console.error("Technician creation error:", techError);
        throw techError;
      }

      const { error: profileError } = await supabase
        .from('profiles')
        .update({ 
          role: formData.role,
          name: formData.name 
        })
        .eq('id', authData.user.id);

      if (profileError) {
        console.error("Profile update error:", profileError);
        throw profileError;
      }

      console.log("Signup completed successfully");

      toast({
        title: "Account created!",
        description: "Please check your email to verify your account.",
      });

      setTimeout(() => {
        navigate("/");
      }, 2000);
    } catch (error: any) {
      console.error("Error during signup:", error);
      toast({
        title: "Error",
        description: error.message || "There was an error creating your account. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSignUp} className="space-y-4">
      <SignUpFormFields 
        formData={formData}
        onChange={handleFormChange}
      />
      <SignUpFormActions 
        loading={loading}
        onBack={onBack}
      />
    </form>
  );
};