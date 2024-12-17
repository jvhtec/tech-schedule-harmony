import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Department } from "@/types/department";
import { useState } from "react";

interface CreateJobDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  currentDepartment: Department;
}

const CreateJobDialog = ({ open, onOpenChange, currentDepartment }: CreateJobDialogProps) => {
  const [selectedDepartments, setSelectedDepartments] = useState<Department[]>([currentDepartment]);

  const availableDepartments: Department[] = ["sound", "lights", "video"];

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <h2 className="text-lg font-semibold">Create Job</h2>
        <div className="space-y-2">
          <Label>Departments</Label>
          <div className="flex flex-col gap-2">
            {availableDepartments.map((dept) => (
              <div key={dept} className="flex items-center space-x-2">
                <Checkbox
                  id={`dept-${dept}`}
                  checked={selectedDepartments.includes(dept)}
                  onCheckedChange={(checked) => {
                    if (checked) {
                      setSelectedDepartments([...selectedDepartments, dept]);
                    } else {
                      setSelectedDepartments(
                        selectedDepartments.filter((d) => d !== dept)
                      );
                    }
                  }}
                />
                <Label htmlFor={`dept-${dept}`}>{dept}</Label>
              </div>
            ))}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default CreateJobDialog;