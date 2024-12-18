import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Check } from "lucide-react";

interface ColorPickerProps {
  color: string;
  onChange: (color: string) => void;
}

export const ColorPicker = ({ color, onChange }: ColorPickerProps) => {
  const colors = [
    "#8B5CF6", // Vivid Purple
    "#D946EF", // Magenta Pink
    "#F97316", // Bright Orange
    "#0EA5E9", // Ocean Blue
    "#6E59A5", // Tertiary Purple
    "#FEC6A1", // Soft Orange
    "#E5DEFF", // Soft Purple
    "#FFDEE2", // Soft Pink
    "#FDE1D3", // Soft Peach
    "#D3E4FD", // Soft Blue
  ];

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
          {colors.map((c) => (
            <button
              key={c}
              className="h-8 w-8 rounded-full relative flex items-center justify-center focus:outline-none focus:ring-2 focus:ring-offset-2"
              style={{ backgroundColor: c }}
              onClick={() => onChange(c)}
              type="button"
            >
              {color === c && (
                <Check className="h-4 w-4 text-white" />
              )}
            </button>
          ))}
        </div>
      </PopoverContent>
    </Popover>
  );
};