import { useState } from "react";
import { useNavigate } from "react-router-dom";
import DepartmentColumn from "@/components/dashboard/DepartmentColumn";
import { UserInfo } from "@/components/UserInfo";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { addDays, format, startOfToday } from "date-fns";
import { Department } from "@/types/department";

const Dashboard = () => {
  const navigate = useNavigate();
  const today = startOfToday();
  const [selectedDate] = useState(today);

  const { data: jobs, isLoading } = useQuery({
    queryKey: ['jobs', format(selectedDate, 'yyyy-MM-dd')],
    queryFn: async () => {
      console.log("Fetching jobs for date:", format(selectedDate, 'yyyy-MM-dd'));
      const { data, error } = await supabase
        .from('jobs')
        .select('*')
        .gte('start_time', format(selectedDate, 'yyyy-MM-dd'))
        .lte('start_time', format(addDays(selectedDate, 1), 'yyyy-MM-dd'));

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
    <div className="container mx-auto py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-4xl font-bold">Dashboard</h1>
        <UserInfo />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {departments.map((department) => (
          <DepartmentColumn
            key={department}
            department={department}
            jobs={getJobsByDepartment(department)}
            onDepartmentClick={() => handleDepartmentClick(department)}
          />
        ))}
      </div>
    </div>
  );
};

export default Dashboard;