import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { format, startOfMonth, endOfMonth, addMonths } from "date-fns";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Calendar, ArrowLeft, ArrowRight } from "lucide-react";
import { DepartmentColumn } from "@/components/dashboard/DepartmentColumn";
import { Job } from "@/types/job";

const Dashboard = () => {
  const navigate = useNavigate();
  const [timeRange, setTimeRange] = useState("1");
  const [currentDate] = useState(new Date());

  const { data: jobs, isLoading } = useQuery({
    queryKey: ["dashboard-jobs", timeRange],
    queryFn: async () => {
      console.log("Fetching jobs for dashboard...");
      const endDate = addMonths(endOfMonth(currentDate), parseInt(timeRange));
      
      const { data, error } = await supabase
        .from("jobs")
        .select("*")
        .gte("start_time", startOfMonth(currentDate).toISOString())
        .lte("start_time", endDate.toISOString())
        .order("start_time", { ascending: true });

      if (error) {
        console.error("Error fetching jobs:", error);
        throw error;
      }
      
      console.log("Fetched jobs:", data);
      return data as Job[];
    },
  });

  const filterJobsByDepartment = (department: string) => {
    return jobs?.filter((job) => job.departments?.includes(department)) || [];
  };

  return (
    <div className="container mx-auto py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-4xl font-bold text-slate-900">Department Dashboard</h1>
        <div className="flex items-center gap-4">
          <Select value={timeRange} onValueChange={setTimeRange}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Select time range" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="1">1 Month</SelectItem>
              <SelectItem value="3">3 Months</SelectItem>
              <SelectItem value="6">6 Months</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {isLoading ? (
        <div className="text-center">Loading jobs...</div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {["sound", "lights", "video"].map((department) => (
            <DepartmentColumn
              key={department}
              department={department}
              jobs={filterJobsByDepartment(department)}
              onHeaderClick={() => navigate(department === "sound" ? "/" : `/${department}`)}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default Dashboard;