import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useQueryClient } from "@tanstack/react-query";
import { Technician } from "@/types/technician";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Department } from "@/types/department";

interface EditTechnicianDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  technician: Technician;
}

export const EditTechnicianDialog = ({
  open,
  onOpenChange,
  technician,
}: EditTechnicianDialogProps) => {
  const [name, setName] = useState(technician.name);
  const [email, setEmail] = useState(technician.email);
  const [phone, setPhone] = useState(technician.phone || "");
  const [dni, setDni] = useState(technician.dni || "");
  const [residencia, setResidencia] = useState(technician.residencia || "");
  const [department, setDepartment] = useState<Department>(technician.department);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      const { error } = await supabase
        .from("technicians")
        .update({
          name,
          email,
          phone,
          dni,
          residencia,
          department,
        })
        .eq("id", technician.id);

      if (error) throw error;

      queryClient.invalidateQueries({ queryKey: ["technicians"] });

      toast({
        title: "Success",
        description: "Technician updated successfully",
      });

      onOpenChange(false);
    } catch (error) {
      console.error("Error updating technician:", error);
      toast({
        title: "Error",
        description: "Failed to update technician",
        variant: "destructive",
      });
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Edit Technician</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Name</Label>
            <Input
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="phone">Phone</Label>
            <Input
              id="phone"
              type="tel"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="dni">DNI</Label>
            <Input
              id="dni"
              value={dni}
              onChange={(e) => setDni(e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="residencia">Residencia</Label>
            <Input
              id="residencia"
              value={residencia}
              onChange={(e) => setResidencia(e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <Label>Department</Label>
            <RadioGroup
              value={department}
              onValueChange={(value) => setDepartment(value as Department)}
              className="flex flex-col space-y-1"
            >
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="sound" id="sound" />
                <Label htmlFor="sound">Sound</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="lights" id="lights" />
                <Label htmlFor="lights">Lights</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="video" id="video" />
                <Label htmlFor="video">Video</Label>
              </div>
            </RadioGroup>
          </div>
          <Button type="submit" className="w-full">Update Technician</Button>
        </form>
      </DialogContent>
    </Dialog>
  );
};