import { FormField, FormItem, FormLabel, FormControl } from "@/components/ui/form";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Control } from "react-hook-form";

interface TransportationSectionProps {
  control: Control<any>;
  hasDriverLicense: boolean;
}

const TransportationSection = ({ control, hasDriverLicense }: TransportationSectionProps) => {
  return (
    <div className="space-y-4">
      <FormField
        control={control}
        name="hasDriverLicense"
        render={({ field }) => (
          <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
            <div className="space-y-0.5">
              <FormLabel className="text-base">Permis de conduire</FormLabel>
            </div>
            <FormControl>
              <Switch
                checked={field.value}
                onCheckedChange={field.onChange}
              />
            </FormControl>
          </FormItem>
        )}
      />

      {hasDriverLicense && (
        <FormField
          control={control}
          name="transportation"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Moyen de transport</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Sélectionnez votre moyen de transport" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="car">Voiture</SelectItem>
                  <SelectItem value="motorcycle">Deux roues</SelectItem>
                  <SelectItem value="both">Les deux</SelectItem>
                  <SelectItem value="none">Aucun</SelectItem>
                </SelectContent>
              </Select>
            </FormItem>
          )}
        />
      )}
    </div>
  );
};

export default TransportationSection;