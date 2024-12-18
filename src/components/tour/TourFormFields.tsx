import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { Department } from "@/types/department";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import { CalendarIcon } from "lucide-react";

interface TourFormFieldsProps {
  title: string;
  setTitle: (title: string) => void;
  description: string;
  setDescription: (description: string) => void;
  dates: { start: string; end: string; location: string }[];
  onDateChange: (index: number, field: "start" | "end" | "location", value: string) => void;
  handleAddDate: () => void;
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
        {dates.map((date, index) => (
          <div key={index} className="space-y-2">
            <div className="grid grid-cols-2 gap-2">
              <div className="space-y-2">
                <Label>Start Date</Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className={cn(
                        "w-full justify-start text-left font-normal",
                        !date.start && "text-muted-foreground"
                      )}
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {date.start ? format(new Date(date.start), "PPP") : <span>Pick a date</span>}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={date.start ? new Date(date.start) : undefined}
                      onSelect={(newDate) => 
                        onDateChange(index, "start", newDate ? newDate.toISOString() : '')
                      }
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
              </div>
              
              <div className="space-y-2">
                <Label>End Date</Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className={cn(
                        "w-full justify-start text-left font-normal",
                        !date.end && "text-muted-foreground"
                      )}
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {date.end ? format(new Date(date.end), "PPP") : <span>Pick a date</span>}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={date.end ? new Date(date.end) : undefined}
                      onSelect={(newDate) => 
                        onDateChange(index, "end", newDate ? newDate.toISOString() : '')
                      }
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
              </div>
            </div>
            
            <Input
              list={`locations-${index}`}
              value={date.location}
              onChange={(e) => onDateChange(index, "location", e.target.value)}
              placeholder="Location"
            />
            <datalist id={`locations-${index}`}>
              {locations?.map((location) => (
                <option key={location} value={location} />
              ))}
            </datalist>
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