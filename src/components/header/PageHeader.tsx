import { Button } from "@/components/ui/button";
import { Plus, Settings, LayoutDashboard } from "lucide-react";
import { UserInfo } from "@/components/UserInfo";
import { Department } from "@/types/department";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/components/AuthProvider";

interface PageHeaderProps {
  department: Department;
  onCreateJob: () => void;
  onCreateTour: () => void;
}

export const PageHeader = ({ department, onCreateJob, onCreateTour }: PageHeaderProps) => {
  const navigate = useNavigate();
  const { userRole } = useAuth();
  
  const departmentTitles = {
    sound: "Sound Department Tech Scheduler",
    lights: "Lights Department Tech Scheduler",
    video: "Video Department Tech Scheduler",
  };

  return (
    <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6 md:mb-8">
      <div className="flex items-center gap-4">
        <Button
          variant="outline"
          size="icon"
          onClick={() => navigate('/dashboard')}
          title="Back to Dashboard"
        >
          <LayoutDashboard className="h-4 w-4" />
        </Button>
        <h1 className="text-2xl md:text-4xl font-bold text-slate-900 break-words">
          {departmentTitles[department]}
        </h1>
      </div>
      <div className="flex flex-col md:flex-row items-start md:items-center gap-4">
        <div className="flex flex-wrap gap-2">
          <Button onClick={onCreateJob}>
            <Plus className="mr-2 h-4 w-4" /> Create Job
          </Button>
          <Button onClick={onCreateTour} variant="secondary">
            <Plus className="mr-2 h-4 w-4" /> Create Tour
          </Button>
          {userRole === 'management' && (
            <Button
              variant="outline"
              size="icon"
              onClick={() => navigate('/settings')}
              title="Settings"
            >
              <Settings className="h-4 w-4" />
            </Button>
          )}
        </div>
        <UserInfo />
      </div>
    </div>
  );
};