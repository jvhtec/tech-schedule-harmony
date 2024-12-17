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
}

export const AssignTechnicianDialog = ({
  open,
  onOpenChange,
  jobId,
  jobTitle,
}: AssignTechnicianDialogProps) => {
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
          />
          <CurrentAssignments assignments={currentAssignments} />
        </div>
      </DialogContent>
    </Dialog>
  );
};