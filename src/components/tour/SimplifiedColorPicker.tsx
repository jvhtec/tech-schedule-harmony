import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";

const TOUR_COLORS = [
  { value: "#8B5CF6", label: "Purple" },
  { value: "#EC4899", label: "Pink" },
  { value: "#F97316", label: "Orange" },
  { value: "#22C55E", label: "Green" },
  { value: "#3B82F6", label: "Blue" },
];

interface SimplifiedColorPickerProps {
  value: string;
  onChange: (color: string) => void;
}

export const SimplifiedColorPicker = ({ value, onChange }: SimplifiedColorPickerProps) => {
  return (
    <div className="space-y-2">
      <Label>Color</Label>
      <div className="flex gap-2 flex-wrap">
        {TOUR_COLORS.map((color) => (
          <Button
            key={color.value}
            type="button"
            className="w-8 h-8 rounded-full p-0 relative"
            style={{ 
              backgroundColor: color.value,
              border: value === color.value ? '2px solid black' : 'none' 
            }}
            onClick={() => onChange(color.value)}
            title={color.label}
          />
        ))}
      </div>
    </div>
  );
};