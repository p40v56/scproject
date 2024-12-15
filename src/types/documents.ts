export interface Document {
  id: string;
  name: string;
  file_path: string;
  file_type: string;
  study_id?: string;
  uploaded_by?: string;
  created_at: string;
  type: string; // This is for UI display purposes
}