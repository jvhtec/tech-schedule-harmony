import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { format, startOfMonth, endOfMonth } from "date-fns";
import CreateJobDialog from "@/components/CreateJobDialog";
import { CreateTourDialog } from "@/components/CreateTourDialog";
import { TechniciansList } from "@/components/TechniciansList";
import { JobsList } from "@/components/JobsList";
import { AssignTechnicianDialog } from "@/components/AssignTechnicianDialog";
import { DepartmentNavigation } from "@/components/DepartmentNavigation";
import { Department } from "@/types/job";
import { PageHeader } from "@/components/header/PageHeader";
import { CalendarCard } from "@/components/calendar/CalendarCard";

interface IndexProps {
  department: Department;
}

const Index = ({ department }: IndexProps) => {
  const [date, setDate] = useState<Date | undefined>(new Date());
  const [isCreateJobOpen, setIsCreateJobOpen] = useState(false);
  const [isCreateTourOpen, setIsCreateTourOpen] = useState(false);
  const [selectedJob, setSelectedJob] = useState<any>(null);

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
      <div className="min-h-screen flex flex-col px-4 py-6 md:py-8">
        <div className="container mx-auto">
          <div className="flex items-center justify-between mb-6 md:mb-8">
            <h1 className="text-2xl font-bold text-red-600">Error loading jobs</h1>
          </div>
          <p className="text-red-500">Failed to load jobs. Please try again later.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col px-4 py-6 md:py-8">
      <div className="container mx-auto">
        <PageHeader
          department={department}
          onCreateJob={() => setIsCreateJobOpen(true)}
          onCreateTour={() => setIsCreateTourOpen(true)}
        />

        <DepartmentNavigation />

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-4 md:gap-6">
          <CalendarCard
            date={date}
            onSelectDate={setDate}
            getJobsForDate={getJobsForDate}
            onSelectJob={setSelectedJob}
            isLoading={isLoadingJobs}
          />

          <div className="space-y-6">
            <TechniciansList department={department} />
            <JobsList jobs={jobs} isLoading={isLoadingJobs} department={department} />
          </div>
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