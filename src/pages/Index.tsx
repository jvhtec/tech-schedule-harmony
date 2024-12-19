import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { format } from "date-fns";
import { Job } from "@/types/job";
import { supabase } from "@/integrations/supabase/client";
import { CalendarCard } from "@/components/calendar/CalendarCard";
import { SimpleTechniciansList } from "@/components/calendar/SimpleTechniciansList";
import { Department } from "@/types/department";
import { PageHeader } from "@/components/header/PageHeader";
import { CreateJobDialog } from "@/components/CreateJobDialog";
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

      console.log("Fetched jobs:", data);
      return data as Job[];
    },
  });

  const getJobsForDate = (date: Date) => {
    if (!jobs) return [];
    return jobs.filter(
      (job) =>
        format(new Date(job.start_time), "yyyy-MM-dd") ===
        format(date, "yyyy-MM-dd")
    );
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
        <SimpleTechniciansList department={department} />
      </div>

      <CreateJobDialog
        open={isCreateJobOpen}
        onOpenChange={setIsCreateJobOpen}
        department={department}
      />

      <CreateTourDialog
        open={isCreateTourOpen}
        onOpenChange={setIsCreateTourOpen}
        department={department}
      />
    </div>
  );
};

export default Index;