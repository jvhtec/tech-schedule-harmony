import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

interface JobAssignmentsProps {
  jobId: string;
}

export const JobAssignments = ({ jobId }: JobAssignmentsProps) => {
  const { data: assignments } = useQuery({
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

  if (!assignments?.length) return null;

  return (
    <div className="mt-2 space-y-1">
      {assignments.map((assignment) => (
        <div
          key={assignment.id}
          className="text-sm text-muted-foreground flex items-center gap-1"
        >
          <span className="font-medium">
            {(assignment.technicians as { name: string }).name}
          </span>
          <span className="text-xs">({assignment.role})</span>
        </div>
      ))}
    </div>
  );
};