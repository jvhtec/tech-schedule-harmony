import { format } from "date-fns";
import { Job } from "@/types/job";
import { Department } from "@/types/department";
import { JobAssignments } from "@/components/JobAssignments";
import { JobActions } from "@/components/jobs/JobActions";
import { useAuth } from "@/components/AuthProvider";

interface JobCardProps {
  job: Job;
  onClick: () => void;
  department: Department;
}

export const JobCard = ({ job, onClick, department }: JobCardProps) => {
  const { userRole } = useAuth();
  const isManagement = userRole === 'management';

  const handleJobOperation = () => {
    console.log("Job operation completed in JobCard");
  };

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
          <div className="flex-1 min-w-0">
            <h3 className="font-medium truncate">
              {job.title}
              {(job.tour_id || job.job_type === 'tour') && (
                <span className="ml-2 text-xs bg-primary/10 text-primary px-2 py-0.5 rounded">
                  {job.tour_id ? 'Tour Date' : 'Tour'}
                </span>
              )}
            </h3>
            <div className="text-sm text-muted-foreground">
              <p>{format(new Date(job.start_time), "MMM d, h:mm a")}</p>
              {job.location && <p className="truncate">{job.location}</p>}
            </div>
          </div>
          {isManagement && (
            <div className="flex-shrink-0" onClick={(e) => e.stopPropagation()}>
              <JobActions 
                job={job} 
                department={department}
                onOperationComplete={handleJobOperation}
              />
            </div>
          )}
        </div>
        <JobAssignments jobId={job.id} department={department} />
      </div>
    </div>
  );
};