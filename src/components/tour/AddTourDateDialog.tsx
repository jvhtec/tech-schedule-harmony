import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useQueryClient } from "@tanstack/react-query";
import { useLocations } from "@/hooks/useLocations";
import { Job } from "@/types/job";

interface AddTourDateDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  tour: Job;
}

export const AddTourDateDialog = ({ open, onOpenChange, tour }: AddTourDateDialogProps) => {
  const [date, setDate] = useState("");
  const [location, setLocation] = useState("");
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const { data: locations } = useLocations();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!date) {
      toast({
        title: "Error",
        description: "Please select a date",
        variant: "destructive",
      });
      return;
    }

    try {
      const { error } = await supabase
        .from("jobs")
        .insert({
          title: `${tour.title} (Tour Date)`,
          description: tour.description,
          start_time: `${date}T00:00:00`,
          end_time: `${date}T23:59:59`,
          location: location,
          job_type: "single",
          tour_id: tour.id,
          color: tour.color,
          departments: tour.departments,
        });

      if (error) throw error;

      // If location is new, add it to locations table
      if (location && !locations?.includes(location)) {
        await supabase
          .from("locations")
          .insert({ name: location })
          .select()
          .maybeSingle();
      }

      await queryClient.invalidateQueries({ queryKey: ["jobs"] });
      await queryClient.invalidateQueries({ queryKey: ["locations"] });

      toast({
        title: "Success",
        description: "Tour date added successfully",
      });

      onOpenChange(false);
      setDate("");
      setLocation("");
    } catch (error) {
      console.error("Error adding tour date:", error);
      toast({
        title: "Error",
        description: "Failed to add tour date",
        variant: "destructive",
      });
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Add Tour Date</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="date">Date</Label>
            <Input
              id="date"
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="location">Location</Label>
            <Input
              id="location"
              list="locations"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              placeholder="Enter location"
            />
            <datalist id="locations">
              {locations?.map((loc) => (
                <option key={loc} value={loc} />
              ))}
            </datalist>
          </div>

          <Button type="submit" className="w-full">
            Add Date
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
};