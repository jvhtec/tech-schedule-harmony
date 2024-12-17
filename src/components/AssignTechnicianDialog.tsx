import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { AssignmentForm } from "./assignment/AssignmentForm";
import { CurrentAssignments } from "./assignment/CurrentAssignments";

interface AssignTechnicianDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  jobId: string;
  jobTitle: string;
  department: "sound" | "lights" | "video";
}

export const AssignTechnicianDialog = ({
  open,
  onOpenChange,
  jobId,
  jobTitle,
  department,
}: AssignTechnicianDialogProps) => {
  const { data: technicians } = useQuery({
    queryKey: ["technicians", department],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("technicians")
        .select("*")
        .eq("department", department);
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

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Assign Technician to {jobTitle}</DialogTitle>
        </DialogHeader>
        <div className="space-y-4 mt-4">
          <AssignmentForm
            jobId={jobId}
            technicians={technicians}
            onSuccess={() => onOpenChange(false)}
            department={department}
          />
          <CurrentAssignments assignments={currentAssignments} />
        </div>
      </DialogContent>
    </Dialog>
  );
};