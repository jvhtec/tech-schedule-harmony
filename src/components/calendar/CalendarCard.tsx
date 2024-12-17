import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { JobCalendar } from "./JobCalendar";
import { DailyJobsList } from "./DailyJobsList";
import { Job } from "@/types/job";

interface CalendarCardProps {
  date: Date | undefined;
  onSelectDate: (date: Date | undefined) => void;
  getJobsForDate: (date: Date) => Job[];
  onSelectJob: (job: Job) => void;
  isLoading: boolean;
}

export const CalendarCard = ({ 
  date, 
  onSelectDate, 
  getJobsForDate, 
  onSelectJob,
  isLoading 
}: CalendarCardProps) => {
  return (
    <Card className="lg:col-span-3">
      <CardHeader>
        <CardTitle>Calendar</CardTitle>
      </CardHeader>
      <CardContent className="p-4">
        {isLoading ? (
          <div className="flex items-center justify-center p-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          </div>
        ) : (
          <div className="space-y-6">
            <JobCalendar
              date={date}
              onSelectDate={onSelectDate}
              getJobsForDate={getJobsForDate}
            />
            {date && (
              <DailyJobsList
                date={date}
                jobs={getJobsForDate(date)}
                onSelectJob={onSelectJob}
              />
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
};