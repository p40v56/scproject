export type Document = {
  id: string;
  name: string;
  type: string;
};

export type Applicant = {
  id: string;
  mission_id: string | null;
  student_id: string | null;
  status: string;
  created_at: string;
  updated_at: string;
  resume_url: string | null;
  cover_letter: string | null;
  selected_at: string | null;
};

export type MissionStatus = "open" | "in-progress" | "closed";

export type Mission = {
  id: string;
  title: string;
  study_level: string;
  status: MissionStatus;
  applicants: Applicant[];
  postedDate: string;
  compensation: number;
  description?: string;
  startDate?: string;
  endDate?: string;
  created_at: string;
  updated_at: string;
  study_id: string | null;
  study_phase_id: string | null;
  assigned_student_id: string | null;
  study: {
    id: string;
    title: string;
  } | null;
  study_phase: {
    id: string;
    name: string;
  } | null;
};