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
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

interface CreateTourDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export const CreateTourDialog = ({ open, onOpenChange }: CreateTourDialogProps) => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [dates, setDates] = useState<{ start: string; end: string }[]>([
    { start: "", end: "" },
  ]);
  const [location, setLocation] = useState("");
  const [color, setColor] = useState("#8B5CF6"); // Default color
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const handleAddDate = () => {
    setDates([...dates, { start: "", end: "" }]);
  };

  const handleDateChange = (
    index: number,
    field: "start" | "end",
    value: string
  ) => {
    const newDates = [...dates];
    newDates[index][field] = value;
    setDates(newDates);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Creating new tour:", { title, dates, location, color });

    try {
      // First, create the main tour record
      const { data: tourData, error: tourError } = await supabase
        .from("jobs")
        .insert({
          title,
          description,
          start_time: dates[0].start, // Use first date as tour start
          end_time: dates[dates.length - 1].end, // Use last date as tour end
          location,
          job_type: "tour",
          color,
        })
        .select()
        .single();

      if (tourError) throw tourError;

      // Then create individual date entries linked to the tour
      const dateEntries = dates.map((date) => ({
        title: `${title} (Tour Date)`,
        description,
        start_time: date.start,
        end_time: date.end,
        location,
        job_type: "single",
        tour_id: tourData.id,
        color,
      }));

      const { error: datesError } = await supabase
        .from("jobs")
        .insert(dateEntries);

      if (datesError) throw datesError;

      // Invalidate and refetch jobs query
      await queryClient.invalidateQueries({ queryKey: ["jobs"] });

      toast({
        title: "Success",
        description: "Tour created successfully",
      });

      onOpenChange(false);
      setTitle("");
      setDescription("");
      setDates([{ start: "", end: "" }]);
      setLocation("");
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
              <div key={index} className="grid grid-cols-2 gap-2">
                <div>
                  <Input
                    type="datetime-local"
                    value={date.start}
                    onChange={(e) =>
                      handleDateChange(index, "start", e.target.value)
                    }
                    required
                  />
                </div>
                <div>
                  <Input
                    type="datetime-local"
                    value={date.end}
                    onChange={(e) =>
                      handleDateChange(index, "end", e.target.value)
                    }
                    required
                  />
                </div>
              </div>
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
            <Label htmlFor="location">Location</Label>
            <Input
              id="location"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <Label>Color</Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className="w-full justify-start text-left font-normal"
                >
                  <div
                    className="h-4 w-4 rounded-full mr-2"
                    style={{ backgroundColor: color }}
                  />
                  {color}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-64">
                <div className="grid grid-cols-5 gap-2">
                  {[
                    "#8B5CF6",
                    "#D946EF",
                    "#F97316",
                    "#0EA5E9",
                    "#6E59A5",
                    "#FEC6A1",
                    "#E5DEFF",
                    "#FFDEE2",
                    "#FDE1D3",
                    "#D3E4FD",
                  ].map((c) => (
                    <button
                      key={c}
                      className={`h-8 w-8 rounded-full focus:outline-none focus:ring-2 focus:ring-offset-2 ${
                        color === c ? "ring-2 ring-offset-2" : ""
                      }`}
                      style={{ backgroundColor: c }}
                      onClick={() => setColor(c)}
                      type="button"
                    />
                  ))}
                </div>
              </PopoverContent>
            </Popover>
          </div>
          <Button type="submit" className="w-full">
            Create Tour
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
};