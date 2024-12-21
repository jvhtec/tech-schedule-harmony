import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";

const JOB_COLORS = [
  { value: "#7E69AB", label: "Purple" },
  { value: "#D6BCFA", label: "Lavender" },
  { value: "#F2FCE2", label: "Mint" },
  { value: "#FEF7CD", label: "Cream" },
  { value: "#FEC6A1", label: "Peach" },
  { value: "#FFDEE2", label: "Rose" },
  { value: "#D3E4FD", label: "Sky" },
  { value: "#F1F0FB", label: "Cloud" },
  { value: "#ea384c", label: "Red" },
  { value: "#33C3F0", label: "Ocean" },
];

interface SimplifiedJobColorPickerProps {
  value: string;
  onChange: (color: string) => void;
}

export const SimplifiedJobColorPicker = ({ value, onChange }: SimplifiedJobColorPickerProps) => {
  return (
    <div className="space-y-2">
      <Label>Color</Label>
      <div className="flex gap-2 flex-wrap">
        {JOB_COLORS.map((color) => (
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