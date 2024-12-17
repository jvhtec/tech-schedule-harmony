import { useState } from "react";
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
import { supabase } from "@/integrations/supabase/client";
import { useQueryClient } from "@tanstack/react-query";

interface AssignmentFormProps {
  jobId: string;
  technicians?: any[];
  onSuccess: () => void;
}

export const JOB_ROLES = [
  "Responsable de Sonido",
  "Tecnico Especialista",
  "Tecnico de Sonido",
  "Auxiliar de Sonido",
] as const;

export type JobRole = typeof JOB_ROLES[number];

export const AssignmentForm = ({ jobId, technicians, onSuccess }: AssignmentFormProps) => {
  const [selectedTechnician, setSelectedTechnician] = useState<string>("");
  const [selectedRole, setSelectedRole] = useState<JobRole | "">("");
  const { toast } = useToast();
  const queryClient = useQueryClient();

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
      const { data: sessionData } = await supabase.auth.getSession();
      const response = await fetch("/functions/v1/send-job-notification", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${sessionData?.session?.access_token}`,
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
      onSuccess();
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
    <div className="space-y-4">
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

      <Button onClick={handleAssign} className="w-full">
        Assign Technician
      </Button>
    </div>
  );
};