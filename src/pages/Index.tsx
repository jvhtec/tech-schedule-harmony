import { useState } from "react";
import { Calendar } from "@/components/ui/calendar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { CreateJobDialog } from "@/components/CreateJobDialog";
import { TechniciansList } from "@/components/TechniciansList";
import { JobsList } from "@/components/JobsList";
import { format } from "date-fns";

const Index = () => {
  const [date, setDate] = useState<Date | undefined>(new Date());
  const [isCreateJobOpen, setIsCreateJobOpen] = useState(false);

  const { data: jobs, isLoading: isLoadingJobs } = useQuery({
    queryKey: ["jobs"],
    queryFn: async () => {
      const { data, error } = await supabase.from("jobs").select("*");
      if (error) throw error;
      return data;
    },
  });

  // Function to get jobs for a specific date
  const getJobsForDate = (date: Date) => {
    if (!jobs) return [];
    return jobs.filter((job) => {
      const jobDate = new Date(job.start_time);
      return (
        jobDate.getDate() === date.getDate() &&
        jobDate.getMonth() === date.getMonth() &&
        jobDate.getFullYear() === date.getFullYear()
      );
    });
  };

  return (
    <div className="container mx-auto py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-4xl font-bold text-slate-900">Tech Scheduler</h1>
        <Button onClick={() => setIsCreateJobOpen(true)}>
          <Plus className="mr-2 h-4 w-4" /> Create Job
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {/* Calendar Section - Now spans 3 columns */}
        <Card className="md:col-span-3">
          <CardHeader>
            <CardTitle>Calendar</CardTitle>
          </CardHeader>
          <CardContent>
            <Calendar
              mode="single"
              selected={date}
              onSelect={setDate}
              className="rounded-md border w-full"
              modifiers={{
                hasJobs: (date) => getJobsForDate(date).length > 0,
              }}
              modifiersStyles={{
                hasJobs: {
                  backgroundColor: "rgb(219 234 254)",
                },
              }}
            />
            {date && (
              <div className="mt-4">
                <h3 className="font-medium mb-2">
                  Jobs for {format(date, "MMMM d, yyyy")}:
                </h3>
                <div className="space-y-2">
                  {getJobsForDate(date).map((job) => (
                    <div
                      key={job.id}
                      className="p-2 bg-blue-50 rounded-lg border border-blue-100"
                    >
                      <p className="font-medium">{job.title}</p>
                      <p className="text-sm text-gray-600">
                        {format(new Date(job.start_time), "h:mm a")} -{" "}
                        {format(new Date(job.end_time), "h:mm a")}
                      </p>
                      {job.location && (
                        <p className="text-sm text-gray-600">{job.location}</p>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Sidebar - Now takes 1 column */}
        <div className="space-y-6">
          <TechniciansList />
          <JobsList jobs={jobs} isLoading={isLoadingJobs} />
        </div>
      </div>

      <CreateJobDialog open={isCreateJobOpen} onOpenChange={setIsCreateJobOpen} />
    </div>
  );
};

export default Index;