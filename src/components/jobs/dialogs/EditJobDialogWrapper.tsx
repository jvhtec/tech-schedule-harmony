import { EditJobDialog } from "@/components/jobs/EditJobDialog";
import { useQueryClient } from "@tanstack/react-query";
import { Job } from "@/types/job";
import { Department } from "@/types/department";

interface EditJobDialogWrapperProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  job: Job;
  department: Department;
}

export const EditJobDialogWrapper = ({ 
  isOpen, 
  onOpenChange, 
  job, 
  department 
}: EditJobDialogWrapperProps) => {
  const queryClient = useQueryClient();

  const handleOpenChange = async (open: boolean) => {
    onOpenChange(open);
    if (!open) {
      console.log("Invalidating queries after edit dialog close");
      await queryClient.invalidateQueries({ 
        predicate: (query) => {
          const queryKey = query.queryKey[0];
          return queryKey === 'jobs' || queryKey === 'job-assignments';
        }
      });
    }
  };

  return (
    <EditJobDialog
      open={isOpen}
      onOpenChange={handleOpenChange}
      job={job}
      department={department}
    />
  );
};