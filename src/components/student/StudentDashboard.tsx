import { Tabs, TabsContent } from "@/components/ui/tabs";
import StudentMissions from "./StudentMissions";
import StudentDocuments from "./StudentDocuments";
import StudentProfile from "./StudentProfile";
import CurrentStudies from "./CurrentStudies";
import CompletedStudies from "./CompletedStudies";

const StudentDashboard = () => {
  return (
    <div className="container mx-auto p-6 space-y-6">
      <Tabs defaultValue="profile" className="space-y-4">
        <TabsContent value="profile">
          <StudentProfile />
        </TabsContent>

        <TabsContent value="documents">
          <StudentDocuments />
        </TabsContent>

        <TabsContent value="missions">
          <StudentMissions />
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