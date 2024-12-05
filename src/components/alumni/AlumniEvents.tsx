import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Calendar } from "@/components/ui/calendar";
import { Button } from "@/components/ui/button";
import { Calendar as CalendarIcon, MapPin, Users } from "lucide-react";
import { useState } from "react";

const AlumniEvents = () => {
  const [date, setDate] = useState<Date | undefined>(new Date());

  const events = [
    {
      id: 1,
      title: "Afterwork Alumni",
      date: "20 Mars 2024",
      time: "19:00",
      location: "Le Petit Journal - Paris",
      attendees: 45,
      type: "Networking",
    },
    {
      id: 2,
      title: "Conférence Annuelle",
      date: "15 Avril 2024",
      time: "14:00",
      location: "Campus SKEMA",
      attendees: 120,
      type: "Conférence",
    },
    {
      id: 3,
      title: "Workshop Innovation",
      date: "5 Mai 2024",
      time: "10:00",
      location: "Station F",
      attendees: 30,
      type: "Formation",
    },
  ];

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Événements</h1>
      
      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Calendrier des événements</CardTitle>
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
            <CardTitle>Prochains événements</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {events.map((event) => (
                <div
                  key={event.id}
                  className="p-4 border rounded-lg hover:bg-gray-50"
                >
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <h3 className="font-semibold">{event.title}</h3>
                      <p className="text-sm text-gray-500">{event.type}</p>
                    </div>
                    <Button variant="outline" size="sm">
                      S'inscrire
                    </Button>
                  </div>
                  <div className="space-y-2">
                    <div className="flex items-center text-sm text-gray-600">
                      <CalendarIcon className="w-4 h-4 mr-2" />
                      {event.date} à {event.time}
                    </div>
                    <div className="flex items-center text-sm text-gray-600">
                      <MapPin className="w-4 h-4 mr-2" />
                      {event.location}
                    </div>
                    <div className="flex items-center text-sm text-gray-600">
                      <Users className="w-4 h-4 mr-2" />
                      {event.attendees} participants
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Événements passés</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {events.slice(0, 2).map((event) => (
              <div
                key={event.id}
                className="p-4 border rounded-lg bg-gray-50"
              >
                <div className="flex justify-between items-center mb-2">
                  <div>
                    <h3 className="font-semibold">{event.title}</h3>
                    <p className="text-sm text-gray-500">{event.type}</p>
                  </div>
                  <Button variant="outline" size="sm">
                    Voir les photos
                  </Button>
                </div>
                <div className="text-sm text-gray-600">
                  {event.date} • {event.location}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AlumniEvents;