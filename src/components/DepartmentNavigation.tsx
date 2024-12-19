import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { Department } from "@/types/department";

interface DepartmentNavigationProps {
  activeDepartment: Department;
}

export const DepartmentNavigation = ({ activeDepartment }: DepartmentNavigationProps) => {
  const navigate = useNavigate();
  const departments = [
    { name: "Sound", path: "/" },
    { name: "Lights", path: "/lights" },
    { name: "Video", path: "/video" },
  ];

  return (
    <div className="flex flex-wrap gap-2 mb-6">
      {departments.map((dept) => (
        <Button
          key={dept.path}
          variant={dept.path === "/" && activeDepartment === "sound" || 
                  dept.path === "/lights" && activeDepartment === "lights" ||
                  dept.path === "/video" && activeDepartment === "video" 
                    ? "default" 
                    : "outline"}
          onClick={() => navigate(dept.path)}
          className="flex-1 md:flex-none"
        >
          {dept.name} Department
        </Button>
      ))}
    </div>
  );
};