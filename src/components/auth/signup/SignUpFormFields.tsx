import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Department } from "@/types/department";
import { Mail, Lock, User, Phone, CreditCard, Building2 } from "lucide-react";

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
  loading?: boolean;
}

export const SignUpFormFields = ({ formData, onChange, loading }: SignUpFormFieldsProps) => {
  return (
    <>
      <div>
        <Label htmlFor="signup-email">Email</Label>
        <div className="relative">
          <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
          <Input
            id="signup-email"
            type="email"
            value={formData.email}
            onChange={(e) => onChange("email", e.target.value)}
            className="pl-10"
            placeholder="Enter your email"
            required
            disabled={loading}
          />
        </div>
      </div>
      
      <div>
        <Label htmlFor="signup-password">Password</Label>
        <div className="relative">
          <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
          <Input
            id="signup-password"
            type="password"
            value={formData.password}
            onChange={(e) => onChange("password", e.target.value)}
            className="pl-10"
            placeholder="Create a password"
            required
            disabled={loading}
            minLength={6}
          />
        </div>
      </div>

      <div>
        <Label htmlFor="name">Full Name</Label>
        <div className="relative">
          <User className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
          <Input
            id="name"
            type="text"
            value={formData.name}
            onChange={(e) => onChange("name", e.target.value)}
            className="pl-10"
            placeholder="Enter your full name"
            required
            disabled={loading}
          />
        </div>
      </div>

      <div>
        <Label htmlFor="phone">Phone</Label>
        <div className="relative">
          <Phone className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
          <Input
            id="phone"
            type="tel"
            value={formData.phone}
            onChange={(e) => onChange("phone", e.target.value)}
            className="pl-10"
            placeholder="Enter your phone number"
            disabled={loading}
          />
        </div>
      </div>

      <div>
        <Label htmlFor="department">Department</Label>
        <Select
          value={formData.department}
          onValueChange={(value: Department) => onChange("department", value)}
          disabled={loading}
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
        <div className="relative">
          <CreditCard className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
          <Input
            id="dni"
            type="text"
            value={formData.dni}
            onChange={(e) => onChange("dni", e.target.value)}
            className="pl-10"
            placeholder="Enter your DNI"
            disabled={loading}
          />
        </div>
      </div>

      <div>
        <Label htmlFor="residencia">Residencia</Label>
        <div className="relative">
          <Building2 className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
          <Input
            id="residencia"
            type="text"
            value={formData.residencia}
            onChange={(e) => onChange("residencia", e.target.value)}
            className="pl-10"
            placeholder="Enter your residencia"
            disabled={loading}
          />
        </div>
      </div>
    </>
  );
};