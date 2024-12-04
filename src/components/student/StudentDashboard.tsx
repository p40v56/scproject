import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import StudentMissions from "./StudentMissions";
import StudentDocuments from "./StudentDocuments";
import StudentProfile from "./StudentProfile";
import CurrentStudies from "./CurrentStudies";
import CompletedStudies from "./CompletedStudies";

const StudentDashboard = () => {
  return (
    <div className="container mx-auto p-6 space-y-6">
      <h1 className="text-2xl font-bold">Tableau de bord étudiant</h1>

      <Tabs defaultValue="missions" className="space-y-4">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="missions">Missions</TabsTrigger>
          <TabsTrigger value="documents">Documents</TabsTrigger>
          <TabsTrigger value="profile">Profil</TabsTrigger>
          <TabsTrigger value="current-studies">Études en cours</TabsTrigger>
          <TabsTrigger value="completed-studies">Études finies</TabsTrigger>
        </TabsList>

        <TabsContent value="missions">
          <StudentMissions />
        </TabsContent>

        <TabsContent value="documents">
          <StudentDocuments />
        </TabsContent>

        <TabsContent value="profile">
          <StudentProfile />
        </TabsContent>

        <TabsContent value="current-studies">
          <CurrentStudies />
        </TabsContent>

        <TabsContent value="completed-studies">
          <CompletedStudies />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default StudentDashboard;