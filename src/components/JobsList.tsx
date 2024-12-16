import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { format } from "date-fns";

interface Job {
  id: string;
  title: string;
  start_time: string;
  end_time: string;
  location?: string;
  description?: string;
}

interface JobsListProps {
  jobs?: Job[];
  isLoading: boolean;
}

export const JobsList = ({ jobs, isLoading }: JobsListProps) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-sm font-medium">All Jobs</CardTitle>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <p className="text-sm text-muted-foreground">Loading jobs...</p>
        ) : jobs && jobs.length > 0 ? (
          <div className="space-y-2">
            {jobs.map((job) => (
              <div
                key={job.id}
                className="flex flex-col p-3 rounded-lg bg-secondary"
              >
                <p className="font-medium">{job.title}</p>
                <p className="text-sm text-muted-foreground">
                  {format(new Date(job.start_time), "MMM d, h:mm a")} -{" "}
                  {format(new Date(job.end_time), "h:mm a")}
                </p>
                {job.location && (
                  <p className="text-sm text-muted-foreground">{job.location}</p>
                )}
                {job.description && (
                  <p className="text-sm text-muted-foreground mt-1">
                    {job.description}
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
  );
};