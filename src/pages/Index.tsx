import { useState } from "react";
import { Calendar } from "@/components/ui/calendar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import CreateJobDialog from "@/components/CreateJobDialog";
import { CreateTourDialog } from "@/components/CreateTourDialog";
import { TechniciansList } from "@/components/TechniciansList";
import { JobsList } from "@/components/JobsList";
import { format, startOfMonth, endOfMonth } from "date-fns";
import { AssignTechnicianDialog } from "@/components/AssignTechnicianDialog";
import { JobAssignments } from "@/components/JobAssignments";
import { DepartmentNavigation } from "@/components/DepartmentNavigation";
import { Department } from "@/types/job";
import { UserInfo } from "@/components/UserInfo";

interface IndexProps {
  department: Department;
}

const Index = ({ department }: IndexProps) => {
  const [date, setDate] = useState<Date | undefined>(new Date());
  const [isCreateJobOpen, setIsCreateJobOpen] = useState(false);
  const [isCreateTourOpen, setIsCreateTourOpen] = useState(false);
  const [selectedJob, setSelectedJob] = useState<any>(null);

  const departmentTitles = {
    sound: "Sound Department Tech Scheduler",
    lights: "Lights Department Tech Scheduler",
    video: "Video Department Tech Scheduler",
  };

  const { data: jobs, isLoading: isLoadingJobs, error } = useQuery({
    queryKey: ["jobs", date ? format(date, "yyyy-MM") : "all", department],
    queryFn: async () => {
      console.log("Fetching jobs...");
      const start = date ? startOfMonth(date).toISOString() : undefined;
      const end = date ? endOfMonth(date).toISOString() : undefined;

      const query = supabase
        .from("jobs")
        .select("*")
        .contains('departments', [department])
        .order("start_time", { ascending: true });

      if (start && end) {
        query.gte("start_time", start).lte("start_time", end);
      }

      const { data, error } = await query;
      
      if (error) {
        console.error("Error fetching jobs:", error);
        throw error;
      }
      console.log("Fetched jobs:", data);
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

  if (error) {
    return (
      <div className="container mx-auto py-8">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-2xl font-bold text-red-600">Error loading jobs</h1>
          <UserInfo />
        </div>
        <p className="text-red-500">Failed to load jobs. Please try again later.</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-4xl font-bold text-slate-900">
          {departmentTitles[department]}
        </h1>
        <div className="flex items-center gap-4">
          <div className="flex space-x-2">
            <Button onClick={() => setIsCreateJobOpen(true)}>
              <Plus className="mr-2 h-4 w-4" /> Create Job
            </Button>
            <Button onClick={() => setIsCreateTourOpen(true)} variant="secondary">
              <Plus className="mr-2 h-4 w-4" /> Create Tour
            </Button>
          </div>
          <UserInfo />
        </div>
      </div>

      <DepartmentNavigation />

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card className="md:col-span-3">
          <CardHeader>
            <CardTitle>Calendar</CardTitle>
          </CardHeader>
          <CardContent>
            {isLoadingJobs ? (
              <div className="flex items-center justify-center p-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
              </div>
            ) : (
              <>
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
                          className="p-2 rounded-lg border cursor-pointer hover:bg-secondary/50 transition-colors"
                          style={{
                            backgroundColor: job.color ? `${job.color}15` : undefined,
                            borderColor: job.color || "hsl(var(--border))",
                          }}
                          onClick={() => setSelectedJob(job)}
                        >
                          <div className="flex items-start justify-between">
                            <div>
                              <p className="font-medium">
                                {job.title}
                                {job.tour_id && (
                                  <span className="ml-2 text-xs bg-primary/10 text-primary px-2 py-0.5 rounded">
                                    Tour
                                  </span>
                                )}
                              </p>
                              <p className="text-sm text-muted-foreground">
                                {format(new Date(job.start_time), "h:mm a")} -{" "}
                                {format(new Date(job.end_time), "h:mm a")}
                              </p>
                              {job.location && (
                                <p className="text-sm text-muted-foreground">
                                  {job.location}
                                </p>
                              )}
                            </div>
                          </div>
                          <JobAssignments jobId={job.id} />
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </>
            )}
          </CardContent>
        </Card>

        <div className="space-y-6">
          <TechniciansList department={department} />
          <JobsList jobs={jobs} isLoading={isLoadingJobs} department={department} />
        </div>
      </div>

      <CreateJobDialog 
        open={isCreateJobOpen} 
        onOpenChange={setIsCreateJobOpen}
        currentDepartment={department}
      />
      <CreateTourDialog
        open={isCreateTourOpen}
        onOpenChange={setIsCreateTourOpen}
        currentDepartment={department}
      />
      
      {selectedJob && (
        <AssignTechnicianDialog
          open={!!selectedJob}
          onOpenChange={(open) => !open && setSelectedJob(null)}
          jobId={selectedJob.id}
          jobTitle={selectedJob.title}
          department={department}
        />
      )}
    </div>
  );
};

export default Index;