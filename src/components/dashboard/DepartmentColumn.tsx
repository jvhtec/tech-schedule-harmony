import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Calendar } from "lucide-react";
import { Job } from "@/types/job";
import { JobCard } from "./JobCard";

interface DepartmentColumnProps {
  department: string;
  jobs: Job[];
  onHeaderClick: () => void;
}

export const DepartmentColumn = ({ department, jobs, onHeaderClick }: DepartmentColumnProps) => {
  return (
    <Card>
      <CardHeader 
        className="cursor-pointer hover:bg-secondary/50 transition-colors"
        onClick={onHeaderClick}
      >
        <CardTitle className="flex items-center gap-2 capitalize">
          <Calendar className="h-5 w-5" />
          {department}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {jobs.length === 0 ? (
          <p className="text-sm text-muted-foreground text-center py-4">
            No upcoming jobs
          </p>
        ) : (
          jobs.map((job) => (
            <JobCard key={job.id} job={job} />
          ))
        )}
      </CardContent>
    </Card>
  );
};