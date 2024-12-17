import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { DepartmentColumn } from "@/components/dashboard/DepartmentColumn";
import { UserInfo } from "@/components/UserInfo";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { addDays, format, startOfToday, endOfDay, startOfDay } from "date-fns";
import { Department } from "@/types/department";
import { Button } from "@/components/ui/button";
import { Settings } from "lucide-react";
import { useAuth } from "@/components/AuthProvider";
import { AssignTechnicianDialog } from "@/components/AssignTechnicianDialog";

const Dashboard = () => {
  const navigate = useNavigate();
  const today = startOfToday();
  const [selectedDate] = useState(today);
  const [selectedJob, setSelectedJob] = useState<any>(null);
  const { userRole } = useAuth();

  const { data: jobs, isLoading } = useQuery({
    queryKey: ['jobs', format(selectedDate, 'yyyy-MM-dd')],
    queryFn: async () => {
      console.log("Fetching jobs for date:", format(selectedDate, 'yyyy-MM-dd'));
      const { data, error } = await supabase
        .from('jobs')
        .select('*')
        .gte('start_time', startOfDay(selectedDate).toISOString())
        .lte('start_time', endOfDay(selectedDate).toISOString())
        .order('start_time', { ascending: true });

      if (error) {
        console.error("Error fetching jobs:", error);
        throw error;
      }

      console.log("Fetched jobs:", data);
      return data;
    },
  });

  const getJobsByDepartment = (department: Department) => {
    if (!jobs) return [];
    return jobs.filter((job) => 
      job.departments && job.departments.includes(department)
    );
  };

  const handleDepartmentClick = (department: Department) => {
    navigate(`/${department === "sound" ? "" : department}`);
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  const departments: Department[] = ["sound", "lights", "video"];

  return (
    <div className="min-h-screen flex flex-col px-4 py-6 md:py-8">
      <div className="container mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6 md:mb-8">
          <h1 className="text-3xl md:text-4xl font-bold">Dashboard</h1>
          <div className="flex items-center gap-4">
            {userRole === 'management' && (
              <Button
                variant="outline"
                size="icon"
                onClick={() => navigate('/settings')}
                title="Settings"
              >
                <Settings className="h-4 w-4" />
              </Button>
            )}
            <UserInfo />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6">
          {departments.map((department) => (
            <DepartmentColumn
              key={department}
              department={department}
              jobs={getJobsByDepartment(department)}
              onHeaderClick={() => handleDepartmentClick(department)}
              onSelectJob={setSelectedJob}
            />
          ))}
        </div>
      </div>

      {selectedJob && (
        <AssignTechnicianDialog
          open={!!selectedJob}
          onOpenChange={(open) => !open && setSelectedJob(null)}
          jobId={selectedJob.id}
          jobTitle={selectedJob.title}
          department={selectedJob.departments?.[0] || "sound"}
        />
      )}
    </div>
  );
};

export default Dashboard;