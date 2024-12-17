import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useQueryClient } from "@tanstack/react-query";
import { Job } from "@/types/job";
import { Department } from "@/types/department";

interface EditJobDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  job: Job;
  department: Department;
}

export const EditJobDialog = ({ open, onOpenChange, job, department }: EditJobDialogProps) => {
  const [title, setTitle] = useState(job.title);
  const [description, setDescription] = useState(job.description || "");
  const [startTime, setStartTime] = useState(job.start_time);
  const [endTime, setEndTime] = useState(job.end_time);
  const [location, setLocation] = useState(job.location || "");
  const [departments, setDepartments] = useState<Department[]>(job.departments);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      const { error } = await supabase
        .from("jobs")
        .update({
          title,
          description,
          start_time: startTime,
          end_time: endTime,
          location,
          departments,
        })
        .eq("id", job.id);

      if (error) throw error;

      await queryClient.invalidateQueries({ queryKey: ["jobs"] });

      toast({
        title: "Success",
        description: "Job updated successfully",
      });

      onOpenChange(false);
    } catch (error) {
      console.error("Error updating job:", error);
      toast({
        title: "Error",
        description: "Failed to update job",
        variant: "destructive",
      });
    }
  };

  const handleDepartmentChange = (dept: Department, checked: boolean) => {
    if (checked) {
      setDepartments([...departments, dept]);
    } else {
      setDepartments(departments.filter(d => d !== dept));
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Edit Job</DialogTitle>
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
            <Label htmlFor="startTime">Start Time</Label>
            <Input
              id="startTime"
              type="datetime-local"
              value={startTime}
              onChange={(e) => setStartTime(e.target.value)}
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="endTime">End Time</Label>
            <Input
              id="endTime"
              type="datetime-local"
              value={endTime}
              onChange={(e) => setEndTime(e.target.value)}
              required
            />
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
            <Label>Departments</Label>
            <div className="flex flex-col gap-2">
              {["sound", "lights", "video"].map((dept) => (
                <div key={dept} className="flex items-center space-x-2">
                  <Checkbox
                    id={`dept-${dept}`}
                    checked={departments.includes(dept as Department)}
                    onCheckedChange={(checked) => 
                      handleDepartmentChange(dept as Department, checked as boolean)
                    }
                    disabled={dept === department}
                  />
                  <label
                    htmlFor={`dept-${dept}`}
                    className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                  >
                    {dept.charAt(0).toUpperCase() + dept.slice(1)}
                  </label>
                </div>
              ))}
            </div>
          </div>
          <Button type="submit" className="w-full">Update Job</Button>
        </form>
      </DialogContent>
    </Dialog>
  );
};