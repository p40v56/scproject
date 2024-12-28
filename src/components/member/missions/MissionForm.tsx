import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import { DialogFooter } from "@/components/ui/dialog";
import { MissionBasicFields } from "./form/MissionBasicFields";
import { MissionStudyFields } from "./form/MissionStudyFields";
import { MissionStatusFields } from "./form/MissionStatusFields";
import { missionSchema, type MissionFormValues } from "./form/types";

type MissionFormProps = {
  onSubmit: (data: MissionFormValues) => void;
  initialData?: MissionFormValues;
  mode?: "create" | "edit";
};

export default function MissionForm({ onSubmit, initialData, mode = "create" }: MissionFormProps) {
  const form = useForm<MissionFormValues>({
    resolver: zodResolver(missionSchema),
    defaultValues: initialData || {
      title: "",
      studyLevel: "",
      compensation: "",
      description: "",
      study_id: null,
      study_phase_id: null,
      status: "open",
    },
  });

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <MissionBasicFields form={form} />
        <MissionStudyFields form={form} />
        <MissionStatusFields form={form} />

        <DialogFooter>
          <Button type="submit">
            {mode === "create" ? "Créer la mission" : "Modifier la mission"}
          </Button>
        </DialogFooter>
      </form>
    </Form>
  );
}