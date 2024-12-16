import { Job, Technician, JobAssignment } from './tables';

export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      jobs: {
        Row: Job;
        Insert: Omit<Job, 'id' | 'created_at'>;
        Update: Partial<Omit<Job, 'id' | 'created_at'>>;
      };
      technicians: {
        Row: Technician;
        Insert: Omit<Technician, 'id' | 'created_at'>;
        Update: Partial<Omit<Technician, 'id' | 'created_at'>>;
      };
      job_assignments: {
        Row: JobAssignment;
        Insert: Omit<JobAssignment, 'id' | 'created_at'>;
        Update: Partial<Omit<JobAssignment, 'id' | 'created_at'>>;
      };
    };
    Views: {
      [_ in never]: never;
    };
    Functions: {
      [_ in never]: never;
    };
    Enums: {
      [_ in never]: never;
    };
    CompositeTypes: {
      [_ in never]: never;
    };
  };
}