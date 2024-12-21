import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { Department } from "@/types/department";
import { Button } from "@/components/ui/button";
import { Trash2 } from "lucide-react";

interface TourFormFieldsProps {
  title: string;
  setTitle: (title: string) => void;
  description: string;
  setDescription: (description: string) => void;
  dates: { start: string; end: string; location: string }[];
  onDateChange: (index: number, field: "start" | "end" | "location", value: string) => void;
  handleAddDate: () => void;
  handleRemoveDate: (index: number) => void;
  departments: Department[];
  handleDepartmentChange: (dept: Department, checked: boolean) => void;
  currentDepartment: Department;
  locations?: string[];
}

export const TourFormFields = ({
  title,
  setTitle,
  description,
  setDescription,
  dates,
  onDateChange,
  handleAddDate,
  handleRemoveDate,
  departments,
  handleDepartmentChange,
  currentDepartment,
  locations,
}: TourFormFieldsProps) => {
  const availableDepartments: Department[] = ["sound", "lights", "video"];

  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="title">Title</Label>
        <Input
          id="title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
        />
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="description">Description</Label>
        <Textarea
          id="description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />
      </div>

      <div className="space-y-2">
        <Label>Tour Dates</Label>
        <div className="space-y-4">
          {dates.map((date, index) => (
            <div key={index} className="p-4 border rounded-lg relative space-y-4">
              {dates.length > 1 && (
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  className="absolute right-2 top-2 text-destructive hover:text-destructive"
                  onClick={() => handleRemoveDate(index)}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              )}
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Start Date</Label>
                  <Input
                    type="datetime-local"
                    value={date.start}
                    onChange={(e) => onDateChange(index, "start", e.target.value)}
                    required
                  />
                </div>
                
                <div className="space-y-2">
                  <Label>End Date</Label>
                  <Input
                    type="datetime-local"
                    value={date.end}
                    onChange={(e) => onDateChange(index, "end", e.target.value)}
                    required
                  />
                </div>
              </div>
              
              <div className="space-y-2">
                <Label>Location</Label>
                <Input
                  list={`locations-${index}`}
                  value={date.location}
                  onChange={(e) => onDateChange(index, "location", e.target.value)}
                  placeholder="Location"
                  className="w-full"
                />
                <datalist id={`locations-${index}`}>
                  {locations?.map((location) => (
                    <option key={location} value={location} />
                  ))}
                </datalist>
              </div>
            </div>
          ))}
          
          <Button
            type="button"
            variant="outline"
            className="w-full"
            onClick={handleAddDate}
          >
            Add Date
          </Button>
        </div>
      </div>

      <div className="space-y-2">
        <Label>Departments</Label>
        <div className="flex flex-col gap-2">
          {availableDepartments.map((dept) => (
            <div key={dept} className="flex items-center space-x-2">
              <Checkbox
                id={`dept-${dept}`}
                checked={departments.includes(dept)}
                onCheckedChange={(checked) => 
                  handleDepartmentChange(dept, checked as boolean)
                }
                disabled={dept === currentDepartment}
              />
              <label
                htmlFor={`dept-${dept}`}
                className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
              >
                {dept.charAt(0).toUpperCase() + dept.slice(1)}
              </label>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};