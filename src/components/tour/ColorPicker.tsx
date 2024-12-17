import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Button } from "@/components/ui/button";

interface ColorPickerProps {
  color: string;
  onChange: (color: string) => void;
}

export const ColorPicker = ({ color, onChange }: ColorPickerProps) => {
  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          className="w-full justify-start text-left font-normal"
        >
          <div
            className="h-4 w-4 rounded-full mr-2"
            style={{ backgroundColor: color }}
          />
          {color}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-64">
        <div className="grid grid-cols-5 gap-2">
          {[
            "#8B5CF6",
            "#D946EF",
            "#F97316",
            "#0EA5E9",
            "#6E59A5",
            "#FEC6A1",
            "#E5DEFF",
            "#FFDEE2",
            "#FDE1D3",
            "#D3E4FD",
          ].map((c) => (
            <button
              key={c}
              className={`h-8 w-8 rounded-full focus:outline-none focus:ring-2 focus:ring-offset-2 ${
                color === c ? "ring-2 ring-offset-2" : ""
              }`}
              style={{ backgroundColor: c }}
              onClick={() => onChange(c)}
              type="button"
            />
          ))}
        </div>
      </PopoverContent>
    </Popover>
  );
};