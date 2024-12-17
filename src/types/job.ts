export type Department = "sound" | "lights" | "video";

export type JobType = "single" | "tour";

export interface Job {
  id: string;
  title: string;
  description?: string;
  start_time: string;
  end_time: string;
  location?: string;
  job_type: JobType;
  tour_id?: string;
  color?: string;
  departments: Department[];
}