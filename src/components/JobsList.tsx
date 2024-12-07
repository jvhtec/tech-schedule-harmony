import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { format } from "date-fns";

interface Job {
  id: string;
  title: string;
  start_time: string;
  end_time: string;
  location?: string;
}

interface JobsListProps {
  jobs?: Job[];
  isLoading: boolean;
}

export const JobsList = ({ jobs, isLoading }: JobsListProps) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-sm font-medium">Upcoming Jobs</CardTitle>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <p className="text-sm text-muted-foreground">Loading jobs...</p>
        ) : (
          <div className="space-y-2">
            {jobs?.map((job) => (
              <div
                key={job.id}
                className="flex flex-col p-2 rounded-lg bg-secondary"
              >
                <p className="font-medium">{job.title}</p>
                <p className="text-sm text-muted-foreground">
                  {format(new Date(job.start_time), "PPp")}
                </p>
                {job.location && (
                  <p className="text-sm text-muted-foreground">{job.location}</p>
                )}
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
};