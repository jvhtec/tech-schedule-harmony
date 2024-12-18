import { Assignment } from "@/types/assignment";
import { Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { useQueryClient } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";

interface CurrentAssignmentsProps {
  assignments?: Assignment[];
  jobId: string;
}

export const CurrentAssignments = ({ assignments, jobId }: CurrentAssignmentsProps) => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  const handleDeassign = async (assignmentId: string) => {
    console.log("Deassigning technician with assignment ID:", assignmentId);
    
    try {
      const { error } = await supabase
        .from("job_assignments")
        .delete()
        .eq("id", assignmentId);

      if (error) throw error;

      // Invalidate and refetch assignments
      queryClient.invalidateQueries({ queryKey: ["job-assignments", jobId] });

      toast({
        title: "Success",
        description: "Technician deassigned successfully",
      });
    } catch (error) {
      console.error("Error deassigning technician:", error);
      toast({
        title: "Error",
        description: "Failed to deassign technician",
        variant: "destructive",
      });
    }
  };

  if (!assignments?.length) return null;

  return (
    <div className="space-y-4">
      <h3 className="font-medium">Current Assignments:</h3>
      <div className="space-y-2">
        {assignments.map((assignment) => {
          const role = assignment.sound_role || assignment.lights_role || assignment.video_role;
          return (
            <div
              key={assignment.id}
              className="p-2 bg-secondary rounded-lg flex justify-between items-center"
            >
              <div>
                <p className="font-medium">
                  {(assignment.technicians as { name: string }).name}
                </p>
                <p className="text-sm text-muted-foreground">
                  {role}
                </p>
              </div>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => handleDeassign(assignment.id)}
                className="h-8 w-8 text-destructive hover:text-destructive hover:bg-destructive/10"
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          );
        })}
      </div>
    </div>
  );
};