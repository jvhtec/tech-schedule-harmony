import { useQueryClient } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Job } from "@/types/job";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

interface DeleteJobDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  job: Job;
}

export const DeleteJobDialog = ({ 
  isOpen, 
  onOpenChange, 
  job 
}: DeleteJobDialogProps) => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  const handleDelete = async () => {
    try {
      console.log("Deleting job:", job.id, "Type:", job.job_type);

      if (job.job_type === 'tour') {
        console.log("Deleting tour dates for tour:", job.id);
        const { error: tourDatesError } = await supabase
          .from('jobs')
          .delete()
          .eq('tour_id', job.id);

        if (tourDatesError) throw tourDatesError;
      }

      const { error } = await supabase
        .from('jobs')
        .delete()
        .eq('id', job.id);

      if (error) throw error;

      console.log("Invalidating queries after job deletion");
      await queryClient.invalidateQueries({ 
        predicate: (query) => {
          const queryKey = query.queryKey[0];
          return queryKey === 'jobs' || queryKey === 'job-assignments';
        }
      });

      toast({
        title: "Success",
        description: "Job deleted successfully",
      });

      onOpenChange(false);
    } catch (error) {
      console.error('Error deleting job:', error);
      toast({
        title: "Error",
        description: "Failed to delete job",
        variant: "destructive",
      });
    }
  };

  const getDeleteDialogContent = () => {
    if (job.job_type === 'tour') {
      return {
        title: "Delete Tour",
        description: "Are you sure you want to delete this tour? This will also delete all associated tour dates.",
      };
    } else if (job.tour_id) {
      return {
        title: "Delete Tour Date",
        description: "Are you sure you want to delete this tour date?",
      };
    }
    return {
      title: "Delete Job",
      description: "Are you sure you want to delete this job?",
    };
  };

  const deleteDialogContent = getDeleteDialogContent();

  return (
    <AlertDialog open={isOpen} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>{deleteDialogContent.title}</AlertDialogTitle>
          <AlertDialogDescription>
            {deleteDialogContent.description}
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction
            onClick={handleDelete}
            className="bg-destructive hover:bg-destructive/90"
          >
            Delete
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};