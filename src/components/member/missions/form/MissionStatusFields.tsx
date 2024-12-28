import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { UseFormReturn } from "react-hook-form";
import { MissionFormValues } from "./types";

type MissionStatusFieldsProps = {
  form: UseFormReturn<MissionFormValues>;
};

export const MissionStatusFields = ({ form }: MissionStatusFieldsProps) => {
  return (
    <>
      <FormField
        control={form.control}
        name="studyLevel"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Niveau d'étude requis</FormLabel>
            <Select onValueChange={field.onChange} value={field.value}>
              <FormControl>
                <SelectTrigger>
                  <SelectValue placeholder="Sélectionnez un niveau" />
                </SelectTrigger>
              </FormControl>
              <SelectContent>
                <SelectItem value="Tous">Tous</SelectItem>
                <SelectItem value="L3">L3</SelectItem>
                <SelectItem value="M1">M1</SelectItem>
                <SelectItem value="M2">M2</SelectItem>
              </SelectContent>
            </Select>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="status"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Statut</FormLabel>
            <Select onValueChange={field.onChange} value={field.value}>
              <FormControl>
                <SelectTrigger>
                  <SelectValue placeholder="Sélectionner un statut" />
                </SelectTrigger>
              </FormControl>
              <SelectContent>
                <SelectItem value="open">Ouverte</SelectItem>
                <SelectItem value="in-progress">En cours</SelectItem>
                <SelectItem value="closed">Fermée</SelectItem>
              </SelectContent>
            </Select>
            <FormMessage />
          </FormItem>
        )}
      />
    </>
  );
};