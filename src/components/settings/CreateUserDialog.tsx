import { useState } from "react";
import { useForm } from "react-hook-form";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useQueryClient } from "@tanstack/react-query";
import { UserFormFields } from "./user-form/UserFormFields";
import { UserFormActions } from "./user-form/UserFormActions";

interface CreateUserDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

type FormData = {
  email: string;
  password: string;
  role: "management" | "logistics" | "technician";
  name: string;
};

const CreateUserDialog = ({ open, onOpenChange }: CreateUserDialogProps) => {
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const queryClient = useQueryClient();
  const { register, handleSubmit, reset, setValue, formState: { errors } } = useForm<FormData>();

  const onSubmit = async (data: FormData) => {
    setLoading(true);
    try {
      console.log("Creating user with email:", data.email);
      
      // First create the auth user
      const { data: authData, error: authError } = await supabase.auth.admin.createUser({
        email: data.email,
        password: data.password,
        email_confirm: true
      });

      if (authError) throw authError;

      if (authData.user) {
        console.log("Auth user created, updating profile...");
        
        // Update the profile with role and name
        const { error: profileError } = await supabase
          .from("profiles")
          .update({ 
            role: data.role,
            name: data.name || data.email
          })
          .eq("id", authData.user.id);

        if (profileError) {
          console.error("Error updating profile:", profileError);
          throw profileError;
        }

        console.log("Profile updated successfully");

        toast({
          title: "Success",
          description: "User created successfully.",
        });
        
        // Invalidate users query to refresh the list
        await queryClient.invalidateQueries({ queryKey: ['users'] });
        onOpenChange(false);
        reset();
      }
    } catch (error: any) {
      console.error("Error creating user:", error);
      toast({
        title: "Error",
        description: error.message || "There was an error creating the user.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Create New User</DialogTitle>
          <DialogDescription>
            Create a new user account with the specified role.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <UserFormFields 
            register={register}
            setValue={setValue}
            errors={errors}
          />
          <UserFormActions 
            onCancel={() => onOpenChange(false)}
            loading={loading}
          />
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default CreateUserDialog;