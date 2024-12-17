import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { format } from "date-fns";
import { AssignTechnicianDialog } from "./AssignTechnicianDialog";
import { Department } from "@/types/job";
import { Job } from "@/types/job";

interface JobsListProps {
  jobs?: Job[];
  isLoading: boolean;
  department: Department;
}

export const JobsList = ({ jobs, isLoading, department }: JobsListProps) => {
  const [selectedJob, setSelectedJob] = useState<Job | null>(null);

  // Filter out tour dates (jobs with tour_id) and show only main tour entries
  const filteredJobs = jobs?.filter((job) => !job.tour_id) || [];

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
            <div className="space-y-2">
              {filteredJobs.map((job) => (
                <div
                  key={job.id}
                  className="flex flex-col p-3 rounded-lg cursor-pointer hover:bg-secondary/80 transition-colors"
                  style={{
                    backgroundColor: job.color ? `${job.color}15` : "hsl(var(--secondary))",
                  }}
                  onClick={() => setSelectedJob(job)}
                >
                  <div className="flex items-center gap-2">
                    <p className="font-medium">{job.title}</p>
                    {job.job_type === "tour" && (
                      <span className="text-xs bg-primary/10 text-primary px-2 py-0.5 rounded">
                        Tour
                      </span>
                    )}
                  </div>
                  <p className="text-sm text-muted-foreground">
                    {format(new Date(job.start_time), "MMM d, h:mm a")} -{" "}
                    {format(new Date(job.end_time), "h:mm a")}
                  </p>
                  {job.location && (
                    <p className="text-sm text-muted-foreground">
                      {job.location}
                    </p>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <p className="text-sm text-muted-foreground">No jobs scheduled</p>
          )}
        </CardContent>
      </Card>

      {selectedJob && (
        <AssignTechnicianDialog
          open={!!selectedJob}
          onOpenChange={(open) => !open && setSelectedJob(null)}
          jobId={selectedJob.id}
          jobTitle={selectedJob.title}
          department={department}
        />
      )}
    </>
  );
};
