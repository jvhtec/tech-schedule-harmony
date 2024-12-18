import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useQueryClient } from "@tanstack/react-query";
import { ColorPicker } from "./tour/ColorPicker";
import { useLocations } from "@/hooks/useLocations";
import { Department } from "@/types/department";
import { TourFormFields } from "./tour/TourFormFields";

interface CreateTourDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  currentDepartment: Department;
}

export const CreateTourDialog = ({ open, onOpenChange, currentDepartment }: CreateTourDialogProps) => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [dates, setDates] = useState<{ start: string; end: string; location: string }[]>([
    { start: "", end: "", location: "" },
  ]);
  const [color, setColor] = useState("#8B5CF6");
  const [departments, setDepartments] = useState<Department[]>([currentDepartment]);
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const { data: locations } = useLocations();

  const handleAddDate = () => {
    setDates([...dates, { start: "", end: "", location: "" }]);
  };

  const handleDateChange = (
    index: number,
    field: "start" | "end" | "location",
    value: string
  ) => {
    const newDates = [...dates];
    newDates[index] = { ...newDates[index], [field]: value };
    setDates(newDates);
  };

  const handleDepartmentChange = (dept: Department, checked: boolean) => {
    if (checked) {
      setDepartments([...departments, dept]);
    } else {
      setDepartments(departments.filter(d => d !== dept));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Creating new tour:", { title, dates, color, departments });

    try {
      const { data: tourData, error: tourError } = await supabase
        .from("jobs")
        .insert({
          title,
          description,
          start_time: dates[0].start,
          end_time: dates[dates.length - 1].end,
          location: dates[0].location,
          job_type: "tour" as const,
          color,
          departments,
        })
        .select()
        .single();

      if (tourError) throw tourError;

      const unique_locations = [...new Set(dates.map((d) => d.location))];
      for (const location of unique_locations) {
        if (location) {
          await supabase
            .from("locations")
            .insert({ name: location })
            .select()
            .maybeSingle();
        }
      }

      const dateEntries = dates.map((date) => ({
        title: `${title} (Tour Date)`,
        description,
        start_time: date.start,
        end_time: date.end,
        location: date.location,
        job_type: "single" as const,
        tour_id: tourData.id,
        color,
        departments,
      }));

      const { error: datesError } = await supabase
        .from("jobs")
        .insert(dateEntries);

      if (datesError) throw datesError;

      await queryClient.invalidateQueries({ queryKey: ["jobs"] });
      await queryClient.invalidateQueries({ queryKey: ["locations"] });

      toast({
        title: "Success",
        description: "Tour created successfully",
      });

      onOpenChange(false);
      setTitle("");
      setDescription("");
      setDates([{ start: "", end: "", location: "" }]);
      setColor("#8B5CF6");
      setDepartments([currentDepartment]);
    } catch (error) {
      console.error("Error creating tour:", error);
      toast({
        title: "Error",
        description: "Failed to create tour",
        variant: "destructive",
      });
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Create New Tour</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <TourFormFields
            title={title}
            setTitle={setTitle}
            description={description}
            setDescription={setDescription}
            dates={dates}
            onDateChange={handleDateChange}
            handleAddDate={handleAddDate}
            departments={departments}
            handleDepartmentChange={handleDepartmentChange}
            currentDepartment={currentDepartment}
            locations={locations}
          />
          <div className="space-y-2">
            <Label>Color</Label>
            <ColorPicker color={color} onChange={setColor} />
          </div>
          <Button type="submit" className="w-full">
            Create Tour
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
};
