import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

interface AssignTechnicianDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  jobId: string;
  jobTitle: string;
}

const JOB_ROLES = [
  "Responsable de Sonido",
  "Tecnico Especialista",
  "Tecnico de Sonido",
  "Auxiliar de Sonido",
] as const;

type JobRole = typeof JOB_ROLES[number];

export const AssignTechnicianDialog = ({
  open,
  onOpenChange,
  jobId,
  jobTitle,
}: AssignTechnicianDialogProps) => {
  const [selectedTechnician, setSelectedTechnician] = useState<string>("");
  const [selectedRole, setSelectedRole] = useState<JobRole | "">("");
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: technicians } = useQuery({
    queryKey: ["technicians"],
    queryFn: async () => {
      const { data, error } = await supabase.from("technicians").select("*");
      if (error) throw error;
      return data;
    },
  });

  const { data: currentAssignments } = useQuery({
    queryKey: ["job-assignments", jobId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("job_assignments")
        .select(`
          *,
          technicians (
            name,
            email
          )
        `)
        .eq("job_id", jobId);
      if (error) throw error;
      return data;
    },
  });

  const handleAssign = async () => {
    if (!selectedTechnician || !selectedRole) {
      toast({
        title: "Error",
        description: "Please select both a technician and a role",
        variant: "destructive",
      });
      return;
    }

    try {
      const { error } = await supabase.from("job_assignments").insert({
        job_id: jobId,
        technician_id: selectedTechnician,
        role: selectedRole,
      });

      if (error) throw error;

      // Send email notification
      const response = await fetch("/functions/v1/send-job-notification", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${supabase.auth.session()?.access_token}`,
        },
        body: JSON.stringify({
          jobId,
          technicianId: selectedTechnician,
          role: selectedRole,
        }),
      });

      if (!response.ok) {
        console.error("Failed to send email notification");
      }

      toast({
        title: "Success",
        description: "Technician assigned successfully",
      });

      queryClient.invalidateQueries({ queryKey: ["job-assignments", jobId] });
      setSelectedTechnician("");
      setSelectedRole("");
    } catch (error) {
      console.error("Error assigning technician:", error);
      toast({
        title: "Error",
        description: "Failed to assign technician",
        variant: "destructive",
      });
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Assign Technician to {jobTitle}</DialogTitle>
        </DialogHeader>
        <div className="space-y-4 mt-4">
          <div className="space-y-2">
            <Label>Role</Label>
            <Select
              value={selectedRole}
              onValueChange={(value) => setSelectedRole(value as JobRole)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select a role" />
              </SelectTrigger>
              <SelectContent>
                {JOB_ROLES.map((role) => (
                  <SelectItem key={role} value={role}>
                    {role}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label>Technician</Label>
            <Select
              value={selectedTechnician}
              onValueChange={setSelectedTechnician}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select a technician" />
              </SelectTrigger>
              <SelectContent>
                {technicians?.map((tech) => (
                  <SelectItem key={tech.id} value={tech.id}>
                    {tech.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-4">
            <h3 className="font-medium">Current Assignments:</h3>
            <div className="space-y-2">
              {currentAssignments?.map((assignment) => (
                <div
                  key={assignment.id}
                  className="p-2 bg-secondary rounded-lg flex justify-between items-center"
                >
                  <div>
                    <p className="font-medium">
                      {(assignment.technicians as { name: string }).name}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      {assignment.role}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <Button onClick={handleAssign} className="w-full">
            Assign Technician
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};