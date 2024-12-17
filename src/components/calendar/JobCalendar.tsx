import { Calendar } from "@/components/ui/calendar";
import { format } from "date-fns";
import { Job } from "@/types/job";

interface JobCalendarProps {
  date: Date | undefined;
  onSelectDate: (date: Date | undefined) => void;
  getJobsForDate: (date: Date) => Job[];
}

export const JobCalendar = ({ date, onSelectDate, getJobsForDate }: JobCalendarProps) => {
  return (
    <Calendar
      mode="single"
      selected={date}
      onSelect={onSelectDate}
      className="rounded-md border"
      modifiers={{
        hasJobs: (date) => getJobsForDate(date).length > 0,
      }}
      modifiersStyles={{
        hasJobs: {
          backgroundColor: "rgb(219 234 254)",
        },
      }}
    />
  );
};