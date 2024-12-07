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

const Index = () => {
  const [date, setDate] = useState<Date | undefined>(new Date());
  const [isCreateJobOpen, setIsCreateJobOpen] = useState(false);

  const { data: jobs, isLoading: isLoadingJobs } = useQuery({
    queryKey: ["jobs"],
    queryFn: async () => {
      console.log("Fetching jobs...");
      const { data, error } = await supabase.from("jobs").select("*");
      if (error) {
        console.error("Error fetching jobs:", error);
        throw error;
      }
      console.log("Jobs fetched:", data);
      return data;
    },
  });

  return (
    <div className="container mx-auto py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-4xl font-bold text-slate-900">Tech Scheduler</h1>
        <Button onClick={() => setIsCreateJobOpen(true)}>
          <Plus className="mr-2 h-4 w-4" /> Create Job
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Calendar Section */}
        <Card className="md:col-span-2">
          <CardHeader>
            <CardTitle>Calendar</CardTitle>
          </CardHeader>
          <CardContent>
            <Calendar
              mode="single"
              selected={date}
              onSelect={setDate}
              className="rounded-md border w-full"
            />
          </CardContent>
        </Card>

        {/* Sidebar */}
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