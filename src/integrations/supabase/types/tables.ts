export interface Job {
  id: string;
  created_at: string;
  title: string;
  description: string | null;
  start_time: string;
  end_time: string;
  location: string | null;
  job_type: "single" | "tour";
  tour_id?: string;
  color?: string;
}

export interface Technician {
  id: string;
  created_at: string;
  name: string;
  email: string;
  phone: string | null;
}

export interface JobAssignment {
  id: string;
  created_at: string;
  job_id: string | null;
  technician_id: string | null;
  status: string | null;
  role: "Responsable de Sonido" | "Tecnico Especialista" | "Tecnico de Sonido" | "Auxiliar de Sonido";
}