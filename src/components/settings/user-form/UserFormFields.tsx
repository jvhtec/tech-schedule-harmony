import { UseFormRegister, UseFormSetValue } from "react-hook-form";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface FormData {
  email: string;
  password: string;
  role: "management" | "logistics" | "technician";
  name: string;
}

interface UserFormFieldsProps {
  register: UseFormRegister<FormData>;
  setValue: UseFormSetValue<FormData>;
  errors: {
    password?: {
      message?: string;
    };
  };
}

export const UserFormFields = ({ register, setValue, errors }: UserFormFieldsProps) => {
  return (
    <>
      <div>
        <Label htmlFor="email">Email</Label>
        <Input
          id="email"
          type="email"
          {...register("email", { required: true })}
        />
      </div>
      <div>
        <Label htmlFor="name">Name</Label>
        <Input
          id="name"
          type="text"
          {...register("name")}
        />
      </div>
      <div>
        <Label htmlFor="password">Password (min. 6 characters)</Label>
        <Input
          id="password"
          type="password"
          {...register("password", { 
            required: true,
            validate: (value) => value.length >= 6 || "Password must be at least 6 characters long"
          })}
        />
        {errors.password && (
          <p className="text-sm text-destructive mt-1">
            {errors.password.message}
          </p>
        )}
      </div>
      <div>
        <Label htmlFor="role">Role</Label>
        <Select onValueChange={(value) => setValue("role", value as "management" | "logistics" | "technician")}>
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