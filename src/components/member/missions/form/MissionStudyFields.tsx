import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { UseFormReturn } from "react-hook-form";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { MissionFormValues } from "./types";

type MissionStudyFieldsProps = {
  form: UseFormReturn<MissionFormValues>;
};

export const MissionStudyFields = ({ form }: MissionStudyFieldsProps) => {
  const { data: studies } = useQuery({
    queryKey: ['studies'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('studies')
        .select('*')
        .eq('status', 'in_progress')
      if (error) throw error
      return data
    }
  });

  const { data: phases } = useQuery({
    queryKey: ['study-phases', form.watch('study_id')],
    queryFn: async () => {
      if (!form.watch('study_id')) return []
      const { data, error } = await supabase
        .from('study_phases')
        .select('*')
        .eq('study_id', form.watch('study_id'))
      if (error) throw error
      return data
    },
    enabled: !!form.watch('study_id')
  });

  const hasAssociatedStudy = form.watch('study_id') && form.watch('study_id') !== 'none';

  return (
    <>
      <FormField
        control={form.control}
        name="study_id"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Étude associée</FormLabel>
            <Select 
              onValueChange={field.onChange} 
              value={field.value || undefined}
              defaultValue={field.value}
            >
              <FormControl>
                <SelectTrigger>
                  <SelectValue 
                    placeholder={hasAssociatedStudy ? undefined : "Sélectionner une étude"} 
                  />
                </SelectTrigger>
              </FormControl>
              <SelectContent>
                {!hasAssociatedStudy && <SelectItem value="none">Aucune</SelectItem>}
                {studies?.map((study) => (
                  <SelectItem key={study.id} value={study.id}>
                    {study.title}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <FormMessage />
          </FormItem>
        )}
      />

      {hasAssociatedStudy && (
        <FormField
          control={form.control}
          name="study_phase_id"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Phase associée</FormLabel>
              <Select onValueChange={field.onChange} value={field.value || undefined}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Sélectionner une phase" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="none">Aucune</SelectItem>
                  {phases?.map((phase) => (
                    <SelectItem key={phase.id} value={phase.id}>
                      {phase.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />
      )}
    </>
  );
};