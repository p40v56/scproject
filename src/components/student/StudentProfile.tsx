import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";
import { useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import MembershipStatus from "./profile/MembershipStatus";
import TransportationSection from "./profile/TransportationSection";
import PersonalInfoSection from "./profile/PersonalInfoSection";
import AcademicInfoSection from "./profile/AcademicInfoSection";

const profileSchema = z.object({
  firstName: z.string(),
  lastName: z.string(),
  email: z.string().email(),
  dateOfBirth: z.string().optional(),
  phoneNumber: z.string().optional(),
  homeAddress: z.string().optional(),
  studyYear: z.string(),
  specialization: z.string(),
  hasDriverLicense: z.boolean(),
  transportation: z.string().optional(),
  campus: z.string(),
});

const StudentProfile = () => {
  const queryClient = useQueryClient();

  const { data: profile, isLoading } = useQuery({
    queryKey: ['profile'],
    queryFn: async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Not authenticated');

      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single();

      if (error) throw error;
      return data;
    },
  });

  const updateProfile = useMutation({
    mutationFn: async (values: z.infer<typeof profileSchema>) => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Not authenticated');

      const { error } = await supabase
        .from('profiles')
        .update({
          first_name: values.firstName,
          last_name: values.lastName,
          study_year: values.studyYear,
          specialization: values.specialization,
          has_driver_license: values.hasDriverLicense,
          transportation: values.transportation,
          campus: values.campus,
          date_of_birth: values.dateOfBirth,
          phone_number: values.phoneNumber,
          home_address: values.homeAddress,
        })
        .eq('id', user.id);

      if (error) throw error;
    },
    onSuccess: () => {
      toast.success("Profil mis à jour avec succès");
      queryClient.invalidateQueries({ queryKey: ['profile'] });
    },
    onError: (error) => {
      console.error('Error updating profile:', error);
      toast.error("Erreur lors de la mise à jour du profil");
    },
  });

  const form = useForm<z.infer<typeof profileSchema>>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      firstName: "",
      lastName: "",
      email: "",
      dateOfBirth: "",
      phoneNumber: "",
      homeAddress: "",
      studyYear: "",
      specialization: "",
      hasDriverLicense: false,
      transportation: "none",
      campus: "",
    },
  });

  useEffect(() => {
    if (profile) {
      form.reset({
        firstName: profile.first_name || "",
        lastName: profile.last_name || "",
        email: profile.email || "",
        dateOfBirth: profile.date_of_birth || "",
        phoneNumber: profile.phone_number || "",
        homeAddress: profile.home_address || "",
        studyYear: profile.study_year || "",
        specialization: profile.specialization || "",
        hasDriverLicense: profile.has_driver_license || false,
        transportation: profile.transportation || "none",
        campus: profile.campus || "",
      });
    }
  }, [profile, form]);

  const onSubmit = (data: z.infer<typeof profileSchema>) => {
    updateProfile.mutate(data);
  };

  if (isLoading) {
    return <div>Chargement...</div>;
  }

  return (
    <div className="space-y-6">
      <MembershipStatus
        membershipPaidDate={profile?.membership_paid_date ? new Date(profile.membership_paid_date) : undefined}
        currentSchoolYear={profile?.current_school_year}
        isMembershipActive={!!profile?.membership_paid_date}
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
              <Button 
                type="submit" 
                className="w-full"
                disabled={updateProfile.isPending}
              >
                {updateProfile.isPending ? "Mise à jour..." : "Mettre à jour"}
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
};

export default StudentProfile;