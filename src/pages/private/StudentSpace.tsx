import DashboardLayout from "@/components/dashboard/DashboardLayout";

const StudentSpace = () => {
  return (
    <DashboardLayout>
      <div className="space-y-8">
        <h1 className="text-2xl font-bold">Espace Étudiant</h1>
        <p>Bienvenue dans votre espace étudiant.</p>
      </div>
    </DashboardLayout>
  );
};

export default StudentSpace;