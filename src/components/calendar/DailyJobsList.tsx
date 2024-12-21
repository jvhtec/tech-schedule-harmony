import { format } from "date-fns";
import { Job } from "@/types/job";
import { JobAssignments } from "@/components/JobAssignments";
import { JobActions } from "@/components/jobs/JobActions";
import { useAuth } from "@/components/AuthProvider";

interface DailyJobsListProps {
  date: Date;
  jobs: Job[];
  onSelectJob: (job: Job) => void;
}

export const DailyJobsList = ({ date, jobs, onSelectJob }: DailyJobsListProps) => {
  const { userRole } = useAuth();
  const isManagement = userRole === 'management';

  return (
    <div>
      <h3 className="font-medium mb-4">Jobs for {format(date, "MMMM d, yyyy")}:</h3>
      <div className="space-y-3">
        {jobs.map((job) => (
          <div
            key={job.id}
            className="p-3 rounded-lg border cursor-pointer hover:bg-secondary/50 transition-colors"
            style={{
              backgroundColor: job.color ? `${job.color}15` : undefined,
              borderColor: job.color || "hsl(var(--border))",
            }}
            onClick={() => onSelectJob(job)}
          >
            <div className="flex items-start justify-between">
              <div className="flex-1 min-w-0">
                <p className="font-medium truncate">
                  {job.title}
                  {(job.tour_id || job.job_type === 'tour') && (
                    <span className="ml-2 text-xs bg-primary/10 text-primary px-2 py-0.5 rounded">
                      {job.tour_id ? 'Tour Date' : 'Tour'}
                    </span>
                  )}
                </p>
                <p className="text-sm text-muted-foreground">
                  {format(new Date(job.start_time), "h:mm a")} -{" "}
                  {format(new Date(job.end_time), "h:mm a")}
                </p>
                {job.location && (
                  <p className="text-sm text-muted-foreground truncate">
                    {job.location}
                  </p>
                )}
              </div>
              {isManagement && (
                <div className="flex-shrink-0" onClick={(e) => e.stopPropagation()}>
                  <JobActions 
                    job={job} 
                    department={job.departments?.[0] || "sound"} 
                  />
                </div>
              )}
            </div>
            <JobAssignments jobId={job.id} />
          </div>
        ))}
      </div>
    </div>
  );
};