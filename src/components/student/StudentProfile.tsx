import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";
import MembershipStatus from "./profile/MembershipStatus";
import TransportationSection from "./profile/TransportationSection";
import PersonalInfoSection from "./profile/PersonalInfoSection";
import AcademicInfoSection from "./profile/AcademicInfoSection";

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
              <PersonalInfoSection control={form.control} />
              <AcademicInfoSection control={form.control} />
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