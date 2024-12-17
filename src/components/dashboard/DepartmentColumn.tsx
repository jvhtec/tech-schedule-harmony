import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Calendar } from "lucide-react";
import { Job } from "@/types/job";
import { Department } from "@/types/department";
import { JobCard } from "./JobCard";

interface DepartmentColumnProps {
  department: Department;
  jobs: Job[];
  onHeaderClick: () => void;
  onSelectJob: (job: Job) => void;
}

export const DepartmentColumn = ({ 
  department, 
  jobs, 
  onHeaderClick,
  onSelectJob 
}: DepartmentColumnProps) => {
  const departmentTitles = {
    sound: "Sound Department",
    lights: "Lights Department",
    video: "Video Department",
  };

  // Filter jobs to only show those that include this department
  const filteredJobs = jobs.filter(job => 
    job.departments && job.departments.includes(department)
  );

  return (
    <Card>
      <CardHeader 
        className="cursor-pointer hover:bg-accent transition-colors"
        onClick={onHeaderClick}
      >
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg font-semibold">
            {departmentTitles[department]}
          </CardTitle>
          <Calendar className="h-5 w-5 text-muted-foreground" />
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {filteredJobs.length === 0 ? (
          <p className="text-sm text-muted-foreground text-center py-4">
            No jobs scheduled
          </p>
        ) : (
          filteredJobs.map((job) => (
            <JobCard 
              key={job.id} 
              job={job} 
              onClick={() => onSelectJob(job)}
            />
          ))
        )}
      </CardContent>
    </Card>
  );
};