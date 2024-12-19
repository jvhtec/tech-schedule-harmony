import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Department } from "@/types/department";
import { useNavigate } from "react-router-dom";

interface SimpleTechniciansListProps {
  department: Department;
}

export const SimpleTechniciansList = ({ department }: SimpleTechniciansListProps) => {
  const navigate = useNavigate();

  const { data: technicians, isLoading } = useQuery({
    queryKey: ["technicians", department],
    queryFn: async () => {
      console.log("Fetching technicians for department:", department);
      const { data, error } = await supabase
        .from("technicians")
        .select("id, name, email")
        .eq("department", department)
        .order('name', { ascending: true });

      if (error) {
        console.error("Error fetching technicians:", error);
        throw error;
      }
      
      console.log("Fetched technicians:", data);
      return data;
    },
  });

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">Technicians</CardTitle>
        <Button 
          variant="outline" 
          size="icon" 
          onClick={() => navigate('/technicians')}
          title="Manage Technicians"
        >
          <Plus className="h-4 w-4" />
        </Button>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <p className="text-sm text-muted-foreground">Loading technicians...</p>
        ) : (
          <div className="space-y-2">
            {technicians?.map((tech) => (
              <div
                key={tech.id}
                className="flex items-center justify-between p-2 rounded-lg bg-secondary"
              >
                <div>
                  <p className="font-medium">{tech.name}</p>
                  <p className="text-sm text-muted-foreground">{tech.email}</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
};