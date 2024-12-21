import { MoreHorizontal, Pencil, Trash2, UserPlus, CalendarPlus } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { Department } from "@/types/department";
import { Job } from "@/types/job";
import { useAuth } from "@/components/AuthProvider";
import { EditJobDialogWrapper } from "./dialogs/EditJobDialogWrapper";
import { AddTourDateDialogWrapper } from "./dialogs/AddTourDateDialogWrapper";
import { DeleteJobDialog } from "./dialogs/DeleteJobDialog";

interface JobActionsProps {
  job: Job;
  department: Department;
  onOperationComplete: () => void;
}

export const JobActions = ({ job, department, onOperationComplete }: JobActionsProps) => {
  const [showEditDialog, setShowEditDialog] = useState(false);
  const [showAssignDialog, setShowAssignDialog] = useState(false);
  const [showAddDateDialog, setShowAddDateDialog] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const { userRole } = useAuth();

  const handleDialogClose = () => {
    console.log("Dialog closed, notifying parent of operation completion");
    onOperationComplete();
  };

  if (userRole !== 'management') return null;

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
        <EditJobDialogWrapper
          isOpen={showEditDialog}
          onOpenChange={(open) => {
            setShowEditDialog(open);
            if (!open) handleDialogClose();
          }}
          job={job}
          department={department}
        />
      )}

      {showAddDateDialog && (
        <AddTourDateDialogWrapper
          isOpen={showAddDateDialog}
          onOpenChange={(open) => {
            setShowAddDateDialog(open);
            if (!open) handleDialogClose();
          }}
          tour={job}
        />
      )}

      {showDeleteDialog && (
        <DeleteJobDialog
          isOpen={showDeleteDialog}
          onOpenChange={(open) => {
            setShowDeleteDialog(open);
            if (!open) handleDialogClose();
          }}
          job={job}
        />
      )}
    </>
  );
};