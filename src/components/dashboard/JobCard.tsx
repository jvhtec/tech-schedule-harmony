import { format } from "date-fns";
import { Job } from "@/types/job";
import { JobAssignments } from "@/components/JobAssignments";

interface JobCardProps {
  job: Job;
  onClick: () => void;
}

export const JobCard = ({ job, onClick }: JobCardProps) => {
  return (
    <div
      className="p-4 rounded-lg border cursor-pointer hover:bg-secondary/50 transition-colors"
      style={{
        backgroundColor: job.color ? `${job.color}15` : undefined,
        borderColor: job.color || "hsl(var(--border))",
      }}
      onClick={onClick}
    >
      <div className="space-y-2">
        <div className="flex items-start justify-between">
          <h3 className="font-medium">
            {job.title}
            {job.job_type === "tour" && (
              <span className="ml-2 text-xs bg-primary/10 text-primary px-2 py-0.5 rounded">
                Tour
              </span>
            )}
          </h3>
        </div>
        <div className="text-sm text-muted-foreground">
          <p>{format(new Date(job.start_time), "MMM d, h:mm a")}</p>
          {job.location && <p>{job.location}</p>}
        </div>
        <JobAssignments jobId={job.id} />
      </div>
    </div>
  );
};