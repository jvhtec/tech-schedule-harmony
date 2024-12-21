import { MoreHorizontal, Pencil, Trash2, UserPlus, CalendarPlus } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { EditJobDialog } from "./EditJobDialog";
import { AssignTechnicianDialog } from "../AssignTechnicianDialog";
import { Department } from "@/types/department";
import { Job } from "@/types/job";
import { useAuth } from "@/components/AuthProvider";
import { AddTourDateDialog } from "../tour/AddTourDateDialog";
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
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useQueryClient } from "@tanstack/react-query";

interface JobActionsProps {
  job: Job;
  department: Department;
}

export const JobActions = ({ job, department }: JobActionsProps) => {
  const [showEditDialog, setShowEditDialog] = useState(false);
  const [showAssignDialog, setShowAssignDialog] = useState(false);
  const [showAddDateDialog, setShowAddDateDialog] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const { userRole } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();

  if (userRole !== 'management') return null;

  const handleDelete = async () => {
    try {
      if (job.job_type === 'tour') {
        // Delete all tour dates first
        const { error: tourDatesError } = await supabase
          .from('jobs')
          .delete()
          .eq('tour_id', job.id);

        if (tourDatesError) throw tourDatesError;
      }

      // Delete the job itself
      const { error } = await supabase
        .from('jobs')
        .delete()
        .eq('id', job.id);

      if (error) throw error;

      await queryClient.invalidateQueries({ queryKey: ['jobs'] });

      toast({
        title: "Success",
        description: "Job deleted successfully",
      });
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
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" className="h-8 w-8 p-0">
            <MoreHorizontal className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuItem onClick={() => setShowEditDialog(true)}>
            <Pencil className="mr-2 h-4 w-4" />
            Edit
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => setShowAssignDialog(true)}>
            <UserPlus className="mr-2 h-4 w-4" />
            Assign Technician
          </DropdownMenuItem>
          {job.job_type === 'tour' && (
            <DropdownMenuItem onClick={() => setShowAddDateDialog(true)}>
              <CalendarPlus className="mr-2 h-4 w-4" />
              Add Date
            </DropdownMenuItem>
          )}
          <DropdownMenuItem 
            onClick={() => setShowDeleteDialog(true)}
            className="text-destructive focus:text-destructive"
          >
            <Trash2 className="mr-2 h-4 w-4" />
            Delete
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      {showEditDialog && (
        <EditJobDialog
          open={showEditDialog}
          onOpenChange={setShowEditDialog}
          job={job}
        />
      )}

      {showAssignDialog && (
        <AssignTechnicianDialog
          open={showAssignDialog}
          onOpenChange={setShowAssignDialog}
          jobId={job.id}
          jobTitle={job.title}
          department={department}
        />
      )}

      {showAddDateDialog && (
        <AddTourDateDialog
          open={showAddDateDialog}
          onOpenChange={setShowAddDateDialog}
          tour={job}
        />
      )}

      <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
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
    </>
  );
};