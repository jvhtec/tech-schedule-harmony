import { useState, Dispatch, SetStateAction } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { format } from "date-fns";
import { AssignTechnicianDialog } from "./AssignTechnicianDialog";
import { Department } from "@/types/department";
import { Job } from "@/types/job";
import { JobActions } from "./jobs/JobActions";

interface JobsListProps {
  jobs?: Job[];
  isLoading: boolean;
  department: Department;
  selectedJob: Job | null;
  onSelectJob: Dispatch<SetStateAction<Job | null>>;
  onJobOperation: () => void;
}

export const JobsList = ({ 
  jobs, 
  isLoading, 
  department, 
  selectedJob, 
  onSelectJob,
  onJobOperation 
}: JobsListProps) => {
  const [dialogJob, setDialogJob] = useState<Job | null>(null);

  // Filter out tour dates (jobs with tour_id) and show only main tour entries
  const filteredJobs = jobs?.filter((job) => !job.tour_id) || [];

  const getBackgroundColor = (color: string | undefined) => {
    if (!color) return "hsl(var(--secondary))";
    // Convert hex to RGB and add transparency
    const hex = color.replace('#', '');
    const r = parseInt(hex.substring(0, 2), 16);
    const g = parseInt(hex.substring(2, 4), 16);
    const b = parseInt(hex.substring(4, 6), 16);
    return `rgba(${r}, ${g}, ${b}, 0.15)`;
  };

  console.log("Rendering jobs with colors:", filteredJobs.map(job => ({ title: job.title, color: job.color })));

  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle className="text-sm font-medium">All Jobs</CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <p className="text-sm text-muted-foreground">Loading jobs...</p>
          ) : filteredJobs.length > 0 ? (
            <div className="space-y-3">
              {filteredJobs.map((job) => {
                console.log(`Rendering job ${job.title} with color:`, job.color);
                return (
                  <div
                    key={job.id}
                    className="flex flex-col p-3 rounded-lg cursor-pointer hover:bg-secondary/80 transition-colors"
                    style={{
                      backgroundColor: getBackgroundColor(job.color),
                      borderLeft: `4px solid ${job.color || 'hsl(var(--secondary))'}`,
                    }}
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex-1 min-w-0">
                        <p className="font-medium truncate">{job.title}</p>
                        {job.job_type === "tour" && (
                          <span className="inline-block text-xs bg-primary/10 text-primary px-2 py-0.5 rounded mt-1">
                            Tour
                          </span>
                        )}
                      </div>
                      <div className="flex-shrink-0">
                        <JobActions 
                          job={job} 
                          department={department}
                          onOperationComplete={onJobOperation}
                        />
                      </div>
                    </div>
                    <div 
                      className="mt-2"
                      onClick={() => setDialogJob(job)}
                    >
                      <p className="text-sm text-muted-foreground">
                        {format(new Date(job.start_time), "MMM d, h:mm a")} -{" "}
                        {format(new Date(job.end_time), "h:mm a")}
                      </p>
                      {job.location && (
                        <p className="text-sm text-muted-foreground truncate">
                          {job.location}
                        </p>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <p className="text-sm text-muted-foreground">No jobs scheduled</p>
          )}
        </CardContent>
      </Card>

      {dialogJob && (
        <AssignTechnicianDialog
          open={!!dialogJob}
          onOpenChange={(open) => !open && setDialogJob(null)}
          jobId={dialogJob.id}
          jobTitle={dialogJob.title}
          department={department}
        />
      )}
    </>
  );
};