import { Technician } from "@/types/technician";
import { Button } from "@/components/ui/button";
import { MoreVertical, Pencil, Trash } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useState } from "react";
import { EditTechnicianDialog } from "./EditTechnicianDialog";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useQueryClient } from "@tanstack/react-query";

interface TechnicianActionsProps {
  technician: Technician;
}

export const TechnicianActions = ({ technician }: TechnicianActionsProps) => {
  const [isEditOpen, setIsEditOpen] = useState(false);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const handleDelete = async () => {
    try {
      // First delete all assignments
      await supabase
        .from("job_assignments")
        .delete()
        .eq("technician_id", technician.id);

      // Then delete the technician
      const { error } = await supabase
        .from("technicians")
        .delete()
        .eq("id", technician.id);

      if (error) throw error;

      toast({
        title: "Success",
        description: "Technician deleted successfully",
      });

      queryClient.invalidateQueries({ queryKey: ["technicians"] });
    } catch (error) {
      console.error("Error deleting technician:", error);
      toast({
        title: "Error",
        description: "Failed to delete technician",
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

      <EditTechnicianDialog
        open={isEditOpen}
        onOpenChange={setIsEditOpen}
        technician={technician}
      />
    </>
  );
};