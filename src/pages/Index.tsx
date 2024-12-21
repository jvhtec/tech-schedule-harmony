import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { format } from "date-fns";
import { Job } from "@/types/job";
import { supabase } from "@/integrations/supabase/client";
import { CalendarCard } from "@/components/calendar/CalendarCard";
import { JobsList } from "@/components/JobsList";
import { Department } from "@/types/department";
import { PageHeader } from "@/components/header/PageHeader";
import CreateJobDialog from "@/components/CreateJobDialog";
import { CreateTourDialog } from "@/components/CreateTourDialog";
import { DepartmentNavigation } from "@/components/DepartmentNavigation";

interface IndexProps {
  department: Department;
}

const Index = ({ department }: IndexProps) => {
  const [selectedDate, setSelectedDate] = useState<Date>();
  const [selectedJob, setSelectedJob] = useState<Job | null>(null);
  const [isCreateJobOpen, setIsCreateJobOpen] = useState(false);
  const [isCreateTourOpen, setIsCreateTourOpen] = useState(false);

  const { data: jobs, isLoading } = useQuery({
    queryKey: ["jobs", department],
    queryFn: async () => {
      console.log("Fetching jobs for department:", department);
      const { data, error } = await supabase
        .from("jobs")
        .select("*")
        .contains('departments', [department]);

      if (error) {
        console.error("Error fetching jobs:", error);
        throw error;
      }

      // If the selected job was deleted, reset it
      if (selectedJob && !data?.find(job => job.id === selectedJob.id)) {
        console.log("Selected job no longer exists, resetting selection");
        setSelectedJob(null);
      }

      console.log("Fetched jobs:", data);
      return data as Job[];
    },
    onError: (error) => {
      console.error("Error in jobs query:", error);
      setSelectedJob(null); // Reset selection on error
    }
  });

  const getJobsForDate = (date: Date) => {
    if (!jobs) return [];
    return jobs.filter(
      (job) =>
        format(new Date(job.start_time), "yyyy-MM-dd") ===
        format(date, "yyyy-MM-dd")
    );
  };

  // Handler to ensure state consistency
  const handleJobOperation = () => {
    console.log("Job operation completed, resetting selected job");
    setSelectedJob(null);
  };

  return (
    <div className="container mx-auto py-8">
      <PageHeader
        department={department}
        onCreateJob={() => setIsCreateJobOpen(true)}
        onCreateTour={() => setIsCreateTourOpen(true)}
      />

      <DepartmentNavigation activeDepartment={department} />

      <div className="mt-8 grid grid-cols-1 lg:grid-cols-4 gap-8">
        <CalendarCard
          date={selectedDate}
          onSelectDate={setSelectedDate}
          getJobsForDate={getJobsForDate}
          onSelectJob={setSelectedJob}
          isLoading={isLoading}
        />
        <div className="lg:col-span-3">
          <JobsList 
            jobs={jobs || []} 
            isLoading={isLoading} 
            selectedJob={selectedJob}
            onSelectJob={setSelectedJob}
            department={department}
            onJobOperation={handleJobOperation}
          />
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
    </div>
  );
};

export default Index;