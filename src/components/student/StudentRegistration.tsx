import { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { useToast } from "@/components/ui/use-toast";

const formSchema = z.object({
  firstName: z.string().min(2, "Le prénom doit contenir au moins 2 caractères"),
  lastName: z.string().min(2, "Le nom doit contenir au moins 2 caractères"),
  studyLevel: z.string(),
  campus: z.string(),
  hasDrivingLicense: z.boolean().default(false),
  idCard: z.instanceof(File).optional(),
  studentCard: z.instanceof(File).optional(),
  insurance: z.instanceof(File).optional(),
  bankDetails: z.instanceof(File).optional(),
  cv: z.instanceof(File).optional(),
});

interface StudentRegistrationProps {
  onComplete: () => void;
}

const StudentRegistration = ({ onComplete }: StudentRegistrationProps) => {
  const { toast } = useToast();
  const [files, setFiles] = useState<{ [key: string]: File | null }>({
    idCard: null,
    studentCard: null,
    insurance: null,
    bankDetails: null,
    cv: null,
  });

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      hasDrivingLicense: false,
    },
  });

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>, fieldName: string) => {
    const file = event.target.files?.[0] || null;
    setFiles(prev => ({ ...prev, [fieldName]: file }));
  };

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    // TODO: Implement actual registration logic
    toast({
      title: "Inscription envoyée",
      description: "Un email de confirmation a été envoyé à votre adresse SKEMA.",
    });
    onComplete();
  };

  return (
    <div className="max-w-2xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6">Inscription Étudiant</h1>
      
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormField
              control={form.control}
              name="firstName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Prénom</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="lastName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nom</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <FormField
            control={form.control}
            name="studyLevel"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Niveau d'études</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Sélectionnez votre niveau" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="l3">L3</SelectItem>
                    <SelectItem value="m1">M1</SelectItem>
                    <SelectItem value="m2">M2</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="campus"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Campus</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Sélectionnez votre campus" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="paris">Paris</SelectItem>
                    <SelectItem value="lille">Lille</SelectItem>
                    <SelectItem value="sophia">Sophia Antipolis</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="hasDrivingLicense"
            render={({ field }) => (
              <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                <FormControl>
                  <Checkbox
                    checked={field.value}
                    onCheckedChange={field.onChange}
                  />
                </FormControl>
                <FormLabel>Permis de conduire</FormLabel>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Documents requis</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <FormLabel>Pièce d'identité</FormLabel>
                <Input type="file" onChange={(e) => handleFileChange(e, 'idCard')} accept="image/*,.pdf" />
              </div>

              <div>
                <FormLabel>Certificat de scolarité</FormLabel>
                <Input type="file" onChange={(e) => handleFileChange(e, 'studentCard')} accept="image/*,.pdf" />
              </div>

              <div>
                <FormLabel>Attestation d'assurance</FormLabel>
                <Input type="file" onChange={(e) => handleFileChange(e, 'insurance')} accept="image/*,.pdf" />
              </div>

              <div>
                <FormLabel>RIB</FormLabel>
                <Input type="file" onChange={(e) => handleFileChange(e, 'bankDetails')} accept="image/*,.pdf" />
              </div>

              <div>
                <FormLabel>CV</FormLabel>
                <Input type="file" onChange={(e) => handleFileChange(e, 'cv')} accept="image/*,.pdf" />
              </div>
            </div>
          </div>

          <Button type="submit" className="w-full">
            S'inscrire
          </Button>
        </form>
      </Form>
    </div>
  );
};

export default StudentRegistration;