import { Button } from "@/components/ui/button";
import { Plus, Users } from "lucide-react";
import { Department } from "@/types/department";
import { UserInfo } from "@/components/UserInfo";
import { useNavigate } from "react-router-dom";

interface PageHeaderProps {
  department: Department;
  onCreateJob: () => void;
  onCreateTour: () => void;
}

export const PageHeader = ({ department, onCreateJob, onCreateTour }: PageHeaderProps) => {
  const navigate = useNavigate();
  
  return (
    <div className="flex items-center justify-between">
      <h1 className="text-4xl font-bold text-slate-900 capitalize">
        {department} Department
      </h1>
      <div className="flex items-center gap-4">
        <Button
          variant="outline"
          onClick={() => navigate('/technicians')}
        >
          <Users className="h-4 w-4 mr-2" />
          Technicians
        </Button>
        <Button onClick={onCreateTour} variant="outline">
          Create Tour
        </Button>
        <Button onClick={onCreateJob}>
          <Plus className="h-4 w-4 mr-2" />
          Create Job
        </Button>
        <UserInfo />
      </div>
    </div>
  );
};