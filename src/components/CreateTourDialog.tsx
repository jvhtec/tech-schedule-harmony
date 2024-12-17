import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useQueryClient } from "@tanstack/react-query";
import { TourDateInput } from "./tour/TourDateInput";
import { ColorPicker } from "./tour/ColorPicker";
import { useLocations } from "@/hooks/useLocations";

interface CreateTourDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export const CreateTourDialog = ({ open, onOpenChange }: CreateTourDialogProps) => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [dates, setDates] = useState<{ start: string; end: string; location: string }[]>([
    { start: "", end: "", location: "" },
  ]);
  const [color, setColor] = useState("#8B5CF6");
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Creating new tour:", { title, dates, color });

    try {
      // First, create the main tour record
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
        })
        .select()
        .single();

      if (tourError) throw tourError;

      // Store unique locations
      const uniqueLocations = [...new Set(dates.map((d) => d.location))];
      for (const location of uniqueLocations) {
        if (location) {
          await supabase
            .from("locations")
            .insert({ name: location })
            .select()
            .maybeSingle();
        }
      }

      // Create individual date entries linked to the tour
      const dateEntries = dates.map((date) => ({
        title: `${title} (Tour Date)`,
        description,
        start_time: date.start,
        end_time: date.end,
        location: date.location,
        job_type: "single" as const,
        tour_id: tourData.id,
        color,
      }));

      const { error: datesError } = await supabase
        .from("jobs")
        .insert(dateEntries);

      if (datesError) throw datesError;

      // Invalidate and refetch queries
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
          <div className="space-y-2">
            <Label htmlFor="title">Title</Label>
            <Input
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <Label>Tour Dates</Label>
            {dates.map((date, index) => (
              <TourDateInput
                key={index}
                index={index}
                date={date}
                onDateChange={handleDateChange}
                locations={locations}
              />
            ))}
            <Button
              type="button"
              variant="outline"
              className="w-full"
              onClick={handleAddDate}
            >
              Add Date
            </Button>
          </div>
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