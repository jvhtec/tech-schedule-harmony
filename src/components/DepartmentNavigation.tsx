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
    <div className="flex gap-2 mb-4">
      {departments.map((dept) => (
        <Button
          key={dept.path}
          variant="outline"
          onClick={() => navigate(dept.path)}
        >
          {dept.name} Department
        </Button>
      ))}
    </div>
  );
};