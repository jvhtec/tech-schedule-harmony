import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Department } from "@/types/department";

interface SignUpFormData {
  email: string;
  password: string;
  name: string;
  phone: string;
  department: Department;
  dni: string;
  residencia: string;
}

interface SignUpFormFieldsProps {
  formData: SignUpFormData;
  onChange: (field: keyof SignUpFormData, value: string | Department) => void;
}

export const SignUpFormFields = ({ formData, onChange }: SignUpFormFieldsProps) => {
  return (
    <>
      <div>
        <Label htmlFor="email">Email</Label>
        <Input
          id="email"
          type="email"
          value={formData.email}
          onChange={(e) => onChange("email", e.target.value)}
          required
        />
      </div>
      <div>
        <Label htmlFor="password">Password (min. 6 characters)</Label>
        <Input
          id="password"
          type="password"
          value={formData.password}
          onChange={(e) => onChange("password", e.target.value)}
          required
          minLength={6}
        />
      </div>
      <div>
        <Label htmlFor="name">Full Name</Label>
        <Input
          id="name"
          value={formData.name}
          onChange={(e) => onChange("name", e.target.value)}
          required
        />
      </div>
      <div>
        <Label htmlFor="phone">Phone Number</Label>
        <Input
          id="phone"
          value={formData.phone}
          onChange={(e) => onChange("phone", e.target.value)}
        />
      </div>
      <div>
        <Label htmlFor="department">Department</Label>
        <Select
          value={formData.department}
          onValueChange={(value: Department) => onChange("department", value)}
        >
          <SelectTrigger>
            <SelectValue placeholder="Select department" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="sound">Sound</SelectItem>
            <SelectItem value="lights">Lights</SelectItem>
            <SelectItem value="video">Video</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <div>
        <Label htmlFor="dni">DNI</Label>
        <Input
          id="dni"
          value={formData.dni}
          onChange={(e) => onChange("dni", e.target.value)}
        />
      </div>
      <div>
        <Label htmlFor="residencia">Residencia</Label>
        <Input
          id="residencia"
          value={formData.residencia}
          onChange={(e) => onChange("residencia", e.target.value)}
        />
      </div>
    </>
  );
};