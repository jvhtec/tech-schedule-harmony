import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowLeft, UserPlus } from "lucide-react";
import { UserInfo } from "@/components/UserInfo";
import { TechniciansList } from "@/components/TechniciansList";
import { useState } from "react";
import { Department } from "@/types/department";
import { useAuth } from "@/components/AuthProvider";
import { useToast } from "@/components/ui/use-toast";

const Technicians = () => {
  const navigate = useNavigate();
  const { userRole } = useAuth();
  const { toast } = useToast();
  const [selectedDepartment, setSelectedDepartment] = useState<Department>("sound");

  // If user is not management, show access denied and redirect
  if (userRole !== 'management') {
    toast({
      title: "Access Denied",
      description: "Only management users can access this page",
      variant: "destructive",
    });
    navigate('/');
    return null;
  }

  return (
    <div className="container mx-auto py-8">
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-4">
          <Button 
            variant="ghost" 
            size="icon"
            onClick={() => navigate(-1)}
          >
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <h1 className="text-4xl font-bold text-slate-900">Technicians Management</h1>
        </div>
        <UserInfo />
      </div>

      <div className="mb-6">
        <div className="inline-flex rounded-lg border p-1">
          <Button
            variant={selectedDepartment === "sound" ? "default" : "ghost"}
            onClick={() => setSelectedDepartment("sound")}
            className="rounded-md px-3"
          >
            Sound
          </Button>
          <Button
            variant={selectedDepartment === "lights" ? "default" : "ghost"}
            onClick={() => setSelectedDepartment("lights")}
            className="rounded-md px-3"
          >
            Lights
          </Button>
          <Button
            variant={selectedDepartment === "video" ? "default" : "ghost"}
            onClick={() => setSelectedDepartment("video")}
            className="rounded-md px-3"
          >
            Video
          </Button>
        </div>
      </div>

      <TechniciansList department={selectedDepartment} />
    </div>
  );
};

export default Technicians;