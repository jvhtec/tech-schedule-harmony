import { useState } from "react";
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
            <div className="space-y-3">
              {filteredJobs.map((job) => (
                <div
                  key={job.id}
                  className="flex flex-col p-3 rounded-lg cursor-pointer hover:bg-secondary/80 transition-colors"
                  style={{
                    backgroundColor: job.color ? `${job.color}15` : "hsl(var(--secondary))",
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
                      <JobActions job={job} department={department} />
                    </div>
                  </div>
                  <div 
                    className="mt-2"
                    onClick={() => setSelectedJob(job)}
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