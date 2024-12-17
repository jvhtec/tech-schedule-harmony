import { format } from "date-fns";
import { Job } from "@/types/job";
import { JobAssignments } from "@/components/JobAssignments";

interface DailyJobsListProps {
  date: Date;
  jobs: Job[];
  onSelectJob: (job: Job) => void;
}

export const DailyJobsList = ({ date, jobs, onSelectJob }: DailyJobsListProps) => {
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
              <div>
                <p className="font-medium">
                  {job.title}
                  {job.tour_id && (
                    <span className="ml-2 text-xs bg-primary/10 text-primary px-2 py-0.5 rounded">
                      Tour
                    </span>
                  )}
                </p>
                <p className="text-sm text-muted-foreground">
                  {format(new Date(job.start_time), "h:mm a")} -{" "}
                  {format(new Date(job.end_time), "h:mm a")}
                </p>
                {job.location && (
                  <p className="text-sm text-muted-foreground">
                    {job.location}
                  </p>
                )}
              </div>
            </div>
            <JobAssignments jobId={job.id} />
          </div>
        ))}
      </div>
    </div>
  );
};