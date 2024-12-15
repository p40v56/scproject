export type Document = {
  id: string;
  name: string;
  type: string;
};

export type Applicant = {
  id: string;
  name: string;
  level: string;
  appliedDate: string;
  email?: string;
  phone?: string;
  school?: string;
  campus?: string;
  specialization?: string;
  experience?: string;
  availability?: string;
  documents?: Document[];
};

export type Mission = {
  id: string;
  title: string;
  study_level: string;
  status: "open" | "closed" | "in-progress";
  applicants: Applicant[];
  postedDate: string;
  compensation: number;
  description?: string;
  startDate?: string;
  endDate?: string;
  created_at: string;
};