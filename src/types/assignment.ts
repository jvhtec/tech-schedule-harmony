export type SoundRole = "Responsable de Sonido" | "Tecnico Especialista" | "Tecnico de Sonido" | "Auxiliar de Sonido";
export type LightsRole = "Responsable de Iluminacion" | "Tecnico especialista" | "Tecnico de Iluminacion" | "Auxiliar de Iluminacion";
export type VideoRole = "Responsable de Video" | "Tecnico de Video" | "Operador/Realizador de Video" | "Operador de Camara" | "Auxiliar de Video";

export interface Assignment {
  id: string;
  created_at: string;
  job_id: string;
  technician_id: string;
  status: string;
  sound_role?: SoundRole;
  lights_role?: LightsRole;
  video_role?: VideoRole;
  technicians: {
    name: string;
    email: string;
    department: string;
  };
}