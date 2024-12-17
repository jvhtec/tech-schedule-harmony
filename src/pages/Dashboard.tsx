import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { UserInfo } from "@/components/UserInfo";
import { DepartmentColumn } from "@/components/dashboard/DepartmentColumn";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { addDays, format, startOfToday } from "date-fns";
import { Department } from "@/types/department";

const Dashboard = () => {
  const navigate = useNavigate();

  const { data: jobs, isLoading } = useQuery({
    queryKey: ["dashboard-jobs"],
    queryFn: async () => {
      const startDate = startOfToday();
      const endDate = addDays(startDate, 7);

      const { data, error } = await supabase
        .from("jobs")
        .select("*")
        .gte("start_time", startDate.toISOString())
        .lt("start_time", endDate.toISOString())
        .order("start_time", { ascending: true });

      if (error) throw error;
      return data;
    },
  });

  const getJobsByDepartment = (department: Department) => {
    if (!jobs) return [];
    return jobs.filter((job) => job.departments.includes(department));
  };

  const handleDepartmentClick = (department: Department) => {
    navigate(`/${department === "sound" ? "" : department}`);
  };

  return (
    <div className="container mx-auto py-8">
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-4">
          <Button 
            variant="ghost" 
            size="icon"
            onClick={() => navigate(-1)}
          >
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <h1 className="text-4xl font-bold">Dashboard</h1>
        </div>
        <UserInfo />
      </div>

      {isLoading ? (
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <DepartmentColumn
            department="sound"
            jobs={getJobsByDepartment("sound")}
            onHeaderClick={() => handleDepartmentClick("sound")}
          />
          <DepartmentColumn
            department="lights"
            jobs={getJobsByDepartment("lights")}
            onHeaderClick={() => handleDepartmentClick("lights")}
          />
          <DepartmentColumn
            department="video"
            jobs={getJobsByDepartment("video")}
            onHeaderClick={() => handleDepartmentClick("video")}
          />
        </div>
      )}
    </div>
  );
};

export default Dashboard;