import { useState } from "react";
import { useForm } from "react-hook-form";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useQueryClient } from "@tanstack/react-query";

interface EditUserDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  user: {
    id: string;
    name: string;
    role: "management" | "logistics" | "technician";
  } | null;
}

type FormData = {
  name: string;
  role: "management" | "logistics" | "technician";
};

const EditUserDialog = ({ open, onOpenChange, user }: EditUserDialogProps) => {
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const queryClient = useQueryClient();
  const { register, handleSubmit, setValue } = useForm<FormData>({
    defaultValues: {
      name: user?.name || "",
      role: user?.role || "logistics",
    },
  });

  const onSubmit = async (data: FormData) => {
    if (!user) return;
    setLoading(true);
    try {
      const { error } = await supabase
        .from("profiles")
        .update({
          name: data.name,
          role: data.role,
        })
        .eq("id", user.id);

      if (error) throw error;

      toast({
        title: "Success",
        description: "User updated successfully.",
      });
      
      queryClient.invalidateQueries({ queryKey: ['users'] });
      onOpenChange(false);
    } catch (error) {
      console.error("Error updating user:", error);
      toast({
        title: "Error",
        description: "There was an error updating the user.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!user) return;
    if (!confirm("Are you sure you want to delete this user? This action cannot be undone.")) return;
    
    setLoading(true);
    try {
      const { error } = await supabase
        .from("profiles")
        .delete()
        .eq("id", user.id);

      if (error) throw error;

      toast({
        title: "Success",
        description: "User deleted successfully.",
      });
      
      queryClient.invalidateQueries({ queryKey: ['users'] });
      onOpenChange(false);
    } catch (error) {
      console.error("Error deleting user:", error);
      toast({
        title: "Error",
        description: "There was an error deleting the user.",
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
          <DialogTitle>Edit User</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <Label htmlFor="name">Name</Label>
            <Input
              id="name"
              {...register("name", { required: true })}
            />
          </div>
          <div>
            <Label htmlFor="role">Role</Label>
            <Select 
              onValueChange={(value) => setValue("role", value as "management" | "logistics" | "technician")}
              defaultValue={user?.role}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select role" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="management">Management</SelectItem>
                <SelectItem value="logistics">Logistics</SelectItem>
                <SelectItem value="technician">Technician</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="flex justify-between gap-4">
            <Button type="button" variant="destructive" onClick={handleDelete}>
              Delete User
            </Button>
            <div className="flex gap-2">
              <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
                Cancel
              </Button>
              <Button type="submit" disabled={loading}>
                {loading ? "Saving..." : "Save Changes"}
              </Button>
            </div>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default EditUserDialog;