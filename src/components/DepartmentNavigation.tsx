import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

export const DepartmentNavigation = () => {
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
          variant="outline"
          onClick={() => navigate(dept.path)}
          className="flex-1 md:flex-none"
        >
          {dept.name} Department
        </Button>
      ))}
    </div>
  );
};