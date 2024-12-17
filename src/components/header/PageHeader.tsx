import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { UserInfo } from "@/components/UserInfo";
import { Department } from "@/types/department";

interface PageHeaderProps {
  department: Department;
  onCreateJob: () => void;
  onCreateTour: () => void;
}

export const PageHeader = ({ department, onCreateJob, onCreateTour }: PageHeaderProps) => {
  const departmentTitles = {
    sound: "Sound Department Tech Scheduler",
    lights: "Lights Department Tech Scheduler",
    video: "Video Department Tech Scheduler",
  };

  return (
    <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6 md:mb-8">
      <h1 className="text-2xl md:text-4xl font-bold text-slate-900 break-words">
        {departmentTitles[department]}
      </h1>
      <div className="flex flex-col md:flex-row items-start md:items-center gap-4">
        <div className="flex flex-wrap gap-2">
          <Button onClick={onCreateJob}>
            <Plus className="mr-2 h-4 w-4" /> Create Job
          </Button>
          <Button onClick={onCreateTour} variant="secondary">
            <Plus className="mr-2 h-4 w-4" /> Create Tour
          </Button>
        </div>
        <UserInfo />
      </div>
    </div>
  );
};