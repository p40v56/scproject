import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";
import MembershipStatus from "./profile/MembershipStatus";
import TransportationSection from "./profile/TransportationSection";

const profileSchema = z.object({
  firstName: z.string(),
  lastName: z.string(),
  email: z.string().email(),
  studyYear: z.string(),
  specialization: z.string(),
  hasDriverLicense: z.boolean(),
  transportation: z.string().optional(),
  campus: z.string(),
});

const StudentProfile = () => {
  const membershipPaidDate = new Date("2024-01-15");
  const currentSchoolYear = "2023-2024";
  const isMembershipActive = true;

  const form = useForm<z.infer<typeof profileSchema>>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      firstName: "Jean",
      lastName: "Dupont",
      email: "jean.dupont@skema.edu",
      studyYear: "M1",
      specialization: "Marketing",
      hasDriverLicense: false,
      transportation: "none",
      campus: "Paris",
    },
  });

  const onSubmit = (data: z.infer<typeof profileSchema>) => {
    toast.success("Profil mis à jour avec succès");
  };

  return (
    <div className="space-y-6">
      <MembershipStatus
        membershipPaidDate={membershipPaidDate}
        currentSchoolYear={currentSchoolYear}
        isMembershipActive={isMembershipActive}
      />

      <Card>
        <CardHeader>
          <CardTitle>Mon profil</CardTitle>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <div className="grid gap-4 md:grid-cols-2">
                <FormField
                  control={form.control}
                  name="firstName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Prénom</FormLabel>
                      <FormControl>
                        <Input {...field} disabled />
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
                        <Input {...field} disabled />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email SKEMA</FormLabel>
                    <FormControl>
                      <Input {...field} disabled />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="studyYear"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Année d'études</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Sélectionnez votre année" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
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
                name="specialization"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Spécialisation</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Sélectionnez votre spécialisation" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="Marketing">Marketing</SelectItem>
                        <SelectItem value="Finance">Finance</SelectItem>
                        <SelectItem value="Management">Management</SelectItem>
                        <SelectItem value="Digital">Digital</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <TransportationSection 
                control={form.control}
                hasDriverLicense={form.watch("hasDriverLicense")}
              />

              <Button type="submit" className="w-full">
                Mettre à jour
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
};

export default StudentProfile;