import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from "zod"
import { Button } from "@/components/ui/button"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { DialogFooter } from "@/components/ui/dialog"
import { Textarea } from "@/components/ui/textarea"
import { useQuery } from "@tanstack/react-query"
import { supabase } from "@/integrations/supabase/client"

const missionSchema = z.object({
  title: z.string().min(2, "Le titre doit faire au moins 2 caractères"),
  studyLevel: z.string().min(1, "Le niveau d'étude est requis"),
  compensation: z.string().min(1, "La rémunération est requise"),
  description: z.string().min(10, "La description doit faire au moins 10 caractères"),
  study_id: z.string().nullable(),
  study_phase_id: z.string().nullable(),
  status: z.enum(["open", "in-progress", "closed"]),
})

type MissionFormProps = {
  onSubmit: (data: z.infer<typeof missionSchema>) => void
  initialData?: z.infer<typeof missionSchema>
  mode?: "create" | "edit"
}

export default function MissionForm({ onSubmit, initialData, mode = "create" }: MissionFormProps) {
  const form = useForm<z.infer<typeof missionSchema>>({
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
  })

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
  })

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
  })

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="title"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Titre de la mission</FormLabel>
              <FormControl>
                <Input {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="study_id"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Étude associée</FormLabel>
              <Select onValueChange={field.onChange} value={field.value || undefined}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Sélectionner une étude" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="none">Aucune</SelectItem>
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

        {form.watch('study_id') && form.watch('study_id') !== 'none' && (
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
          name="compensation"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Rémunération (€)</FormLabel>
              <FormControl>
                <Input type="number" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Description</FormLabel>
              <FormControl>
                <Textarea {...field} />
              </FormControl>
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

        <DialogFooter>
          <Button type="submit">
            {mode === "create" ? "Créer la mission" : "Modifier la mission"}
          </Button>
        </DialogFooter>
      </form>
    </Form>
  )
}
