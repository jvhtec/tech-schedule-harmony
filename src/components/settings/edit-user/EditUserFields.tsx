import { UseFormRegister } from "react-hook-form";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface FormData {
  name: string;
  role: "management" | "logistics" | "technician";
}

interface EditUserFieldsProps {
  register: UseFormRegister<FormData>;
  defaultRole?: "management" | "logistics" | "technician";
  onRoleChange: (value: "management" | "logistics" | "technician") => void;
}

export const EditUserFields = ({ register, defaultRole, onRoleChange }: EditUserFieldsProps) => {
  return (
    <>
      <div>
        <Label htmlFor="name">Name</Label>
        <Input
          id="name"
          {...register("name", { required: true })}
        />
      </div>
      <div>
        <Label htmlFor="role">Role</Label>
        <Select 
          onValueChange={(value) => onRoleChange(value as "management" | "logistics" | "technician")}
          defaultValue={defaultRole}
        >
          <SelectTrigger>
            <SelectValue placeholder="Select role" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="management">Management</SelectItem>
            <SelectItem value="logistics">Logistics</SelectItem>
            <SelectItem value="technician">Technician</SelectItem>
          </SelectContent>
        </Select>
      </div>
    </>
  );
};