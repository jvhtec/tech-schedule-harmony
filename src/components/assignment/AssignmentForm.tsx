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
import { Department } from "@/types/job";
import { Technician } from "@/types/technician";
import { useQuery } from "@tanstack/react-query";
import { CurrentAssignments } from "./CurrentAssignments";
import { Assignment } from "@/types/assignment";

const DEPARTMENT_ROLES = {
  sound: [
    "Responsable de Sonido",
    "Tecnico Especialista",
    "Tecnico de Sonido",
    "Auxiliar de Sonido",
  ],
  lights: [
    "Responsable de Iluminacion",
    "Tecnico especialista",
    "Tecnico de Iluminacion",
    "Auxiliar de Iluminacion",
  ],
  video: [
    "Responsable de Video",
    "Tecnico de Video",
    "Operador/Realizador de Video",
    "Operador de Camara",
    "Auxiliar de Video",
  ],
} as const;

interface AssignmentFormProps {
  jobId: string;
  technicians?: Technician[];
  onSuccess: () => void;
  department: Department;
}

export const AssignmentForm = ({
  jobId,
  technicians,
  onSuccess,
  department,
}: AssignmentFormProps) => {
  const [selectedTechnician, setSelectedTechnician] = useState<string>("");
  const [selectedRole, setSelectedRole] = useState<string>("");
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: assignments } = useQuery({
    queryKey: ["job-assignments", jobId],
    queryFn: async () => {
      console.log("Fetching assignments for job:", jobId);
      const { data, error } = await supabase
        .from("job_assignments")
        .select(`
          *,
          technicians (
            name,
            email,
            department
          )
        `)
        .eq("job_id", jobId);

      if (error) {
        console.error("Error fetching assignments:", error);
        throw error;
      }

      if (!data) return [];

      console.log("Assignments data:", data);
      return data as unknown as Assignment[];
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
      const roleColumn = `${department}_role`;
      const { error } = await supabase.from("job_assignments").insert({
        job_id: jobId,
        technician_id: selectedTechnician,
        [roleColumn]: selectedRole,
      });

      if (error) throw error;

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
      <CurrentAssignments assignments={assignments} jobId={jobId} />

      <div className="space-y-2">
        <Label>Role</Label>
        <Select
          value={selectedRole}
          onValueChange={setSelectedRole}
        >
          <SelectTrigger>
            <SelectValue placeholder="Select a role" />
          </SelectTrigger>
          <SelectContent>
            {DEPARTMENT_ROLES[department].map((role) => (
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