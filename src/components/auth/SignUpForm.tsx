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
  });

  const handleFormChange = (field: keyof SignUpFormData, value: string | Department) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      console.log("Starting signup process with email:", formData.email);

      // Create technician record which will trigger the database function to create auth user and profile
      const { error: techError } = await supabase
        .from("technicians")
        .insert({
          name: formData.name,
          email: formData.email.toLowerCase(),
          phone: formData.phone || null,
          department: formData.department,
          dni: formData.dni || null,
          residencia: formData.residencia || null,
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

      // Wait a moment before redirecting to ensure all operations are complete
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