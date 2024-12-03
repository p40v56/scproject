import DashboardLayout from "@/components/dashboard/DashboardLayout";

const ClientSpace = () => {
  return (
    <DashboardLayout>
      <div className="space-y-8">
        <h1 className="text-2xl font-bold">Espace Client</h1>
        <p>Bienvenue dans votre espace client.</p>
      </div>
    </DashboardLayout>
  );
};

export default ClientSpace;