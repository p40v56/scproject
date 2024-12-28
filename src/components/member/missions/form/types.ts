import { z } from "zod";

export const missionSchema = z.object({
  title: z.string().min(2, "Le titre doit faire au moins 2 caractères"),
  studyLevel: z.string().min(1, "Le niveau d'étude est requis"),
  compensation: z.string().min(1, "La rémunération est requise"),
  description: z.string().min(10, "La description doit faire au moins 10 caractères"),
  study_id: z.union([z.literal("none"), z.string()]).nullable(),
  study_phase_id: z.string().nullable(),
  status: z.enum(["open", "in-progress", "closed"]),
});

export type MissionFormValues = z.infer<typeof missionSchema>;