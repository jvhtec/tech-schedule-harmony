export interface Job {
  id: string;
  created_at: string;
  title: string;
  description: string | null;
  start_time: string;
  end_time: string;
  location: string | null;
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
}