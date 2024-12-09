import { useState } from "react"
import { Bell, CheckCircle, AlertCircle, Info } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"

interface AlertItem {
  id: number
  type: "info" | "warning" | "success"
  title: string
  message: string
  date: string
  read: boolean
}

const Alerts = () => {
  const [alerts, setAlerts] = useState<AlertItem[]>([
    {
      id: 1,
      type: "info",
      title: "Nouveau document disponible",
      message: "Un nouveau document a été ajouté à votre dossier.",
      date: "2024-01-15",
      read: false,
    },
    {
      id: 2,
      type: "warning",
      title: "Rendez-vous à venir",
      message: "Rappel : vous avez un rendez-vous demain à 14h.",
      date: "2024-01-14",
      read: false,
    },
    {
      id: 3,
      type: "success",
      title: "Document validé",
      message: "Votre document a été validé avec succès.",
      date: "2024-01-13",
      read: true,
    },
  ])

  const markAsRead = (alertId: number) => {
    setAlerts(alerts.map(alert => 
      alert.id === alertId ? { ...alert, read: true } : alert
    ))
  }

  const getAlertIcon = (type: string) => {
    switch (type) {
      case "info":
        return <Info className="h-4 w-4" />
      case "warning":
        return <AlertCircle className="h-4 w-4" />
      case "success":
        return <CheckCircle className="h-4 w-4" />
      default:
        return <Bell className="h-4 w-4" />
    }
  }

  const getAlertVariant = (type: string) => {
    switch (type) {
      case "warning":
        return "destructive"
      default:
        return "default"
    }
  }

  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-bold">Alertes</h2>
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Bell className="h-5 w-5" />
            Centre de notifications
          </CardTitle>
        </CardHeader>
        <CardContent>
          <ScrollArea className="h-[calc(100vh-16rem)]">
            <div className="space-y-4">
              {alerts.map((alert) => (
                <Alert 
                  key={alert.id} 
                  variant={getAlertVariant(alert.type)}
                  className={`relative ${alert.read ? 'opacity-60' : ''}`}
                >
                  {getAlertIcon(alert.type)}
                  <AlertTitle className="flex items-center justify-between">
                    {alert.title}
                    <span className="text-sm font-normal">{alert.date}</span>
                  </AlertTitle>
                  <AlertDescription className="mt-2">
                    {alert.message}
                    {!alert.read && (
                      <Button
                        variant="link"
                        className="absolute bottom-2 right-2"
                        onClick={() => markAsRead(alert.id)}
                      >
                        Marquer comme lu
                      </Button>
                    )}
                  </AlertDescription>
                </Alert>
              ))}
            </div>
          </ScrollArea>
        </CardContent>
      </Card>
    </div>
  )
}

export default Alerts