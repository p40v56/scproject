import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Calendar as CalendarIcon } from "lucide-react";
import { useState } from "react";

const Appointments = () => {
  const [date, setDate] = useState<Date | undefined>(new Date());

  const appointments = [
    {
      id: 1,
      date: "15 Avril 2024",
      time: "14:00",
      type: "Présentation des résultats",
      with: "Jean Dupont",
    },
    {
      id: 2,
      date: "20 Avril 2024",
      time: "10:00",
      type: "Point d'avancement",
      with: "Marie Martin",
    },
  ];

  return (
    <div className="grid gap-6 md:grid-cols-2">
      <Card>
        <CardHeader>
          <CardTitle>Prochains rendez-vous</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {appointments.map((appointment) => (
              <div
                key={appointment.id}
                className="flex items-center justify-between p-4 border rounded-lg"
              >
                <div>
                  <p className="font-medium">{appointment.type}</p>
                  <p className="text-sm text-muted-foreground">
                    {appointment.date} à {appointment.time}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    avec {appointment.with}
                  </p>
                </div>
                <Button variant="outline" size="sm">
                  Annuler
                </Button>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Prendre rendez-vous</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <Calendar
              mode="single"
              selected={date}
              onSelect={setDate}
              className="rounded-md border"
            />
            <Button className="w-full gap-2">
              <CalendarIcon className="w-4 h-4" />
              Demander un rendez-vous
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Appointments;