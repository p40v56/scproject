import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Calendar as CalendarIcon } from "lucide-react";

const events = [
  {
    id: 1,
    title: "Réunion CA",
    date: "2024-04-15",
    time: "14:00",
    type: "Réunion",
  },
  {
    id: 2,
    title: "Point d'avancement études",
    date: "2024-04-20",
    time: "10:00",
    type: "Point d'avancement",
  },
];

export default function MemberCalendar() {
  const [date, setDate] = useState<Date | undefined>(new Date());

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Calendrier</h2>
        <Button>
          <CalendarIcon className="mr-2 h-4 w-4" />
          Ajouter un événement
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Calendrier</CardTitle>
          </CardHeader>
          <CardContent>
            <Calendar
              mode="single"
              selected={date}
              onSelect={setDate}
              className="rounded-md border"
            />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Événements à venir</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {events.map((event) => (
                <div
                  key={event.id}
                  className="flex items-center justify-between p-4 border rounded-lg"
                >
                  <div>
                    <p className="font-medium">{event.title}</p>
                    <p className="text-sm text-muted-foreground">
                      {event.date} à {event.time}
                    </p>
                    <p className="text-sm text-muted-foreground">{event.type}</p>
                  </div>
                  <Button variant="outline" size="sm">
                    Détails
                  </Button>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}