export interface Technician {
  id: string;
  name: string;
  email: string;
  phone?: string;
  department: "sound" | "lights" | "video";
  dni?: string;
  residencia?: string;
}