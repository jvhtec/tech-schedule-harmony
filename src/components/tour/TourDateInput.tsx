import { Input } from "@/components/ui/input";

interface TourDateInputProps {
  index: number;
  date: {
    start: string;
    end: string;
    location: string;
  };
  onDateChange: (
    index: number,
    field: "start" | "end" | "location",
    value: string
  ) => void;
  locations?: string[];
}

export const TourDateInput = ({
  index,
  date,
  onDateChange,
  locations,
}: TourDateInputProps) => {
  return (
    <div className="space-y-2">
      <div className="grid grid-cols-2 gap-2">
        <div>
          <Input
            type="datetime-local"
            value={date.start}
            onChange={(e) => onDateChange(index, "start", e.target.value)}
            required
          />
        </div>
        <div>
          <Input
            type="datetime-local"
            value={date.end}
            onChange={(e) => onDateChange(index, "end", e.target.value)}
            required
          />
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
  );
};