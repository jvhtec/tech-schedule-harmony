import { AddTourDateDialog } from "@/components/tour/AddTourDateDialog";
import { useQueryClient } from "@tanstack/react-query";
import { Job } from "@/types/job";

interface AddTourDateDialogWrapperProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  tour: Job;
}

export const AddTourDateDialogWrapper = ({ 
  isOpen, 
  onOpenChange, 
  tour 
}: AddTourDateDialogWrapperProps) => {
  const queryClient = useQueryClient();

  const handleOpenChange = async (open: boolean) => {
    onOpenChange(open);
    if (!open) {
      console.log("Invalidating queries after add tour date dialog close");
      await queryClient.invalidateQueries({ 
        predicate: (query) => {
          const queryKey = query.queryKey[0];
          return queryKey === 'jobs';
        }
      });
    }
  };

  return (
    <AddTourDateDialog
      open={isOpen}
      onOpenChange={handleOpenChange}
      tour={tour}
    />
  );
};