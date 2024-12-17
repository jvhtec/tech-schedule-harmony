import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/components/ui/use-toast";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";

interface TechniciansListProps {
  department: "sound" | "lights" | "video";
}

export const TechniciansList = ({ department }: TechniciansListProps) => {
  const [isAddTechOpen, setIsAddTechOpen] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [dni, setDni] = useState("");
  const [residencia, setResidencia] = useState("");
  const [selectedDepartment, setSelectedDepartment] = useState<"sound" | "lights" | "video">(department);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: technicians, isLoading } = useQuery({
    queryKey: ["technicians", department],
    queryFn: async () => {
      console.log("Fetching technicians for department:", department);
      const { data, error } = await supabase
        .from("technicians")
        .select("*")
        .eq("department", department);
      if (error) throw error;
      return data;
    },
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      const { error } = await supabase.from("technicians").insert({
        name,
        email,
        phone,
        dni,
        residencia,
        department: selectedDepartment,
      });

      if (error) throw error;

      toast({
        title: "Success",
        description: "Technician added successfully",
      });

      queryClient.invalidateQueries({ queryKey: ["technicians"] });
      setIsAddTechOpen(false);
      setName("");
      setEmail("");
      setPhone("");
      setDni("");
      setResidencia("");
      setSelectedDepartment(department);
    } catch (error) {
      console.error("Error adding technician:", error);
      toast({
        title: "Error",
        description: "Failed to add technician",
        variant: "destructive",
      });
    }
  };

  return (
    <>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Technicians</CardTitle>
          <Button variant="outline" size="icon" onClick={() => setIsAddTechOpen(true)}>
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
                    {tech.phone && (
                      <p className="text-sm text-muted-foreground">{tech.phone}</p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      <Dialog open={isAddTechOpen} onOpenChange={setIsAddTechOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add New Technician</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">Name</Label>
              <Input
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="phone">Phone</Label>
              <Input
                id="phone"
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="dni">DNI</Label>
              <Input
                id="dni"
                value={dni}
                onChange={(e) => setDni(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="residencia">Residencia</Label>
              <Input
                id="residencia"
                value={residencia}
                onChange={(e) => setResidencia(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label>Department</Label>
              <RadioGroup
                value={selectedDepartment}
                onValueChange={(value) => setSelectedDepartment(value as "sound" | "lights" | "video")}
                className="flex flex-col space-y-1"
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="sound" id="sound" />
                  <Label htmlFor="sound">Sound</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="lights" id="lights" />
                  <Label htmlFor="lights">Lights</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="video" id="video" />
                  <Label htmlFor="video">Video</Label>
                </div>
              </RadioGroup>
            </div>
            <Button type="submit" className="w-full">Add Technician</Button>
          </form>
        </DialogContent>
      </Dialog>
    </>
  );
};