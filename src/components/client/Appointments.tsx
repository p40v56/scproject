import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { UpcomingAppointments } from "./appointments/UpcomingAppointments"
import { PastAppointments } from "./appointments/PastAppointments"
import { NewAppointment } from "./appointments/NewAppointment"

const Appointments = () => {
  return (
    <div className="space-y-6">
      <Tabs defaultValue="upcoming" className="w-full">
        <TabsList className="mb-4">
          <TabsTrigger value="upcoming">À venir</TabsTrigger>
          <TabsTrigger value="past">Historique</TabsTrigger>
          <TabsTrigger value="new">Nouveau rendez-vous</TabsTrigger>
        </TabsList>

        <TabsContent value="upcoming">
          <Card>
            <CardHeader>
              <CardTitle>Rendez-vous à venir</CardTitle>
            </CardHeader>
            <CardContent>
              <UpcomingAppointments />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="past">
          <Card>
            <CardHeader>
              <CardTitle>Historique des rendez-vous</CardTitle>
            </CardHeader>
            <CardContent>
              <PastAppointments />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="new">
          <Card>
            <CardHeader>
              <CardTitle>Planifier un rendez-vous</CardTitle>
            </CardHeader>
            <CardContent>
              <NewAppointment />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}

export default Appointments