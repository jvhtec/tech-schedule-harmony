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

interface JobActionsProps {
  job: Job;
  department: "sound" | "lights" | "video";
}

export const JobActions = ({ job, department }: JobActionsProps) => {
  const [isEditOpen, setIsEditOpen] = useState(false);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const handleDelete = async () => {
    try {
      // First delete all assignments
      await supabase
        .from("job_assignments")
        .delete()
        .eq("job_id", job.id);

      // Then delete the job
      const { error } = await supabase
        .from("jobs")
        .delete()
        .eq("id", job.id);

      if (error) throw error;

      toast({
        title: "Success",
        description: "Job deleted successfully",
      });

      queryClient.invalidateQueries({ queryKey: ["jobs"] });
    } catch (error) {
      console.error("Error deleting job:", error);
      toast({
        title: "Error",
        description: "Failed to delete job",
        variant: "destructive",
      });
    }
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
          <DropdownMenuItem onClick={handleDelete} className="text-destructive">
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
    </>
  );
};