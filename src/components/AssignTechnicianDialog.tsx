import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { AssignmentForm } from "./assignment/AssignmentForm";
import { Department } from "@/types/department";
import { Technician } from "@/types/technician";

interface AssignTechnicianDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  jobId: string;
  jobTitle: string;
  department: Department;
}

export const AssignTechnicianDialog = ({
  open,
  onOpenChange,
  jobId,
  jobTitle,
  department,
}: AssignTechnicianDialogProps) => {
  const { data: technicians, isLoading } = useQuery({
    queryKey: ["technicians", department],
    queryFn: async () => {
      console.log("Fetching technicians for department:", department);
      const { data, error } = await supabase
        .from("technicians")
        .select("*")
        .eq("department", department);

      if (error) {
        console.error("Error fetching technicians:", error);
        throw error;
      }
      
      console.log("Fetched technicians:", data);
      return data as Technician[];
    },
  });

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Assign Technician to {jobTitle}</DialogTitle>
        </DialogHeader>
        {isLoading ? (
          <div className="flex items-center justify-center p-4">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          </div>
        ) : (
          <AssignmentForm
            jobId={jobId}
            technicians={technicians}
            onSuccess={() => onOpenChange(false)}
            department={department}
          />
        )}
      </DialogContent>
    </Dialog>
  );
};