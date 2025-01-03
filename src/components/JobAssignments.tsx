import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Assignment } from "@/types/assignment";
import { Department } from "@/types/department";

interface JobAssignmentsProps {
  jobId: string;
  department?: Department;
}

interface TechnicianData {
  name: string;
  email: string;
  department: Department;
}

export const JobAssignments = ({ jobId, department }: JobAssignmentsProps) => {
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

      console.log("Assignments data:", data);
      return data as Assignment[];
    },
  });

  if (!assignments?.length) return null;

  // Filter assignments based on department if specified
  const filteredAssignments = department
    ? assignments.filter(assignment => {
        const technicianData = assignment.technicians as TechnicianData;
        return technicianData.department === department;
      })
    : assignments;

  if (!filteredAssignments.length) return null;

  return (
    <div className="mt-2 space-y-1">
      {filteredAssignments.map((assignment) => {
        const role = assignment.sound_role || assignment.lights_role || assignment.video_role;
        const technicianData = assignment.technicians as TechnicianData;
        
        return (
          <div
            key={assignment.id}
            className="text-sm text-muted-foreground flex items-center gap-1"
          >
            <span className="font-medium">
              {technicianData.name}
            </span>
            <span className="text-xs">({role})</span>
          </div>
        );
      })}
    </div>
  );
};