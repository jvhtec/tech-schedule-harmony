import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Check } from "lucide-react";

interface ColorPickerProps {
  value: string;
  onChange: (color: string) => void;
}

export const ColorPicker = ({ value, onChange }: ColorPickerProps) => {
  // Predefined color palette for jobs
  const colors = [
    "#9b87f5", // Primary Purple
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

  console.log("ColorPicker rendered with value:", value);

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          className="w-full justify-start text-left font-normal"
        >
          <div className="flex items-center gap-2">
            <div
              className="h-4 w-4 rounded-full border border-input"
              style={{ backgroundColor: value }}
            />
            <span className="truncate">Selected Color</span>
          </div>
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-64">
        <div className="grid grid-cols-5 gap-2">
          {colors.map((color) => (
            <Button
              key={color}
              variant="ghost"
              className="relative h-8 w-8 rounded-full p-0 hover:scale-110 transition-transform"
              style={{ backgroundColor: color }}
              onClick={() => {
                console.log("Color selected:", color);
                onChange(color);
              }}
            >
              {value === color && (
                <Check className="h-4 w-4 text-white absolute inset-0 m-auto" />
              )}
              <span className="sr-only">Select color {color}</span>
            </Button>
          ))}
        </div>
      </PopoverContent>
    </Popover>
  );
};