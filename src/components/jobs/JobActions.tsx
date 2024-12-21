import { Job } from "@/types/job";
import { Button } from "@/components/ui/button";
import { MoreVertical, Pencil, Trash } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useState } from "react";
import { EditJobDialog } from "./EditJobDialog";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useQueryClient } from "@tanstack/react-query";
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

interface JobActionsProps {
  job: Job;
  department: "sound" | "lights" | "video";
}

export const JobActions = ({ job, department }: JobActionsProps) => {
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const handleDelete = async () => {
    try {
      console.log("Deleting job:", job);

      // If this is a tour date (has tour_id), just delete this specific date
      if (job.tour_id) {
        console.log("Deleting single tour date:", job.id);
        const { error } = await supabase
          .from("jobs")
          .delete()
          .eq("id", job.id);

        if (error) {
          console.error("Error deleting tour date:", error);
          throw error;
        }
      } else if (job.job_type === 'tour') {
        // If this is a main tour entry, delete all associated dates first
        console.log("Deleting entire tour and its dates:", job.id);
        const { error: tourDatesError } = await supabase
          .from("jobs")
          .delete()
          .eq("tour_id", job.id);

        if (tourDatesError) {
          console.error("Error deleting tour dates:", tourDatesError);
          throw tourDatesError;
        }

        // Then delete the main tour entry
        const { error } = await supabase
          .from("jobs")
          .delete()
          .eq("id", job.id);

        if (error) {
          console.error("Error deleting main tour:", error);
          throw error;
        }
      } else {
        // Regular job deletion
        const { error } = await supabase
          .from("jobs")
          .delete()
          .eq("id", job.id);

        if (error) {
          console.error("Error deleting job:", error);
          throw error;
        }
      }

      toast({
        title: "Success",
        description: "Job deleted successfully",
      });

      queryClient.invalidateQueries({ queryKey: ["jobs"] });
    } catch (error) {
      console.error("Error in delete operation:", error);
      toast({
        title: "Error",
        description: "Failed to delete job",
        variant: "destructive",
      });
    } finally {
      setShowDeleteConfirm(false);
    }
  };

  const getDeleteConfirmMessage = () => {
    if (job.tour_id) {
      return "Are you sure you want to delete this tour date?";
    } else if (job.job_type === 'tour') {
      return "Are you sure you want to delete this entire tour and all its dates?";
    }
    return "Are you sure you want to delete this job?";
  };

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" size="icon">
            <MoreVertical className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuItem onClick={() => setIsEditOpen(true)}>
            <Pencil className="mr-2 h-4 w-4" />
            Edit
          </DropdownMenuItem>
          <DropdownMenuItem 
            onClick={() => setShowDeleteConfirm(true)} 
            className="text-destructive"
          >
            <Trash className="mr-2 h-4 w-4" />
            Delete
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <EditJobDialog
        open={isEditOpen}
        onOpenChange={setIsEditOpen}
        job={job}
        department={department}
      />

      <AlertDialog open={showDeleteConfirm} onOpenChange={setShowDeleteConfirm}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Confirmation</AlertDialogTitle>
            <AlertDialogDescription>
              {getDeleteConfirmMessage()}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete} className="bg-destructive text-destructive-foreground">
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
};