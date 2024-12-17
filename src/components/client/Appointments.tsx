import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card } from "@/components/ui/card"
import { UpcomingAppointments } from "./appointments/UpcomingAppointments"
import { PastAppointments } from "./appointments/PastAppointments"
import { NewAppointment } from "./appointments/NewAppointment"

const Appointments = () => {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold">Rendez-vous</h2>
        <p className="text-muted-foreground">
          Gérez vos rendez-vous passés et à venir
        </p>
      </div>

      <Tabs defaultValue="upcoming" className="space-y-4">
        <TabsList>
          <TabsTrigger value="upcoming">À venir</TabsTrigger>
          <TabsTrigger value="past">Passés</TabsTrigger>
          <TabsTrigger value="new">Nouveau</TabsTrigger>
        </TabsList>

        <TabsContent value="upcoming">
          <Card className="p-6">
            <UpcomingAppointments />
          </Card>
        </TabsContent>

        <TabsContent value="past">
          <Card className="p-6">
            <PastAppointments />
          </Card>
        </TabsContent>

        <TabsContent value="new">
          <Card className="p-6">
            <NewAppointment />
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}

export default Appointments