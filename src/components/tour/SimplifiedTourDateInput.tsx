import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Trash2 } from "lucide-react";

interface SimplifiedTourDateInputProps {
  index: number;
  date: {
    date: string;
    location: string;
  };
  onDateChange: (index: number, field: "date" | "location", value: string) => void;
  onRemove: () => void;
  showRemove: boolean;
  locations?: string[];
}

export const SimplifiedTourDateInput = ({
  index,
  date,
  onDateChange,
  onRemove,
  showRemove,
  locations,
}: SimplifiedTourDateInputProps) => {
  return (
    <div className="p-4 border rounded-lg relative space-y-4">
      {showRemove && (
        <Button
          type="button"
          variant="ghost"
          size="icon"
          className="absolute right-2 top-2 text-destructive hover:text-destructive"
          onClick={onRemove}
        >
          <Trash2 className="h-4 w-4" />
        </Button>
      )}
      
      <div className="space-y-2">
        <Input
          type="date"
          value={date.date}
          onChange={(e) => onDateChange(index, "date", e.target.value)}
          required
        />
      </div>
      
      <div className="space-y-2">
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
    </div>
  );
};