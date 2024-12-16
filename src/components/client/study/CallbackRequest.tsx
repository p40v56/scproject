import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Phone } from "lucide-react"
import { useToast } from "@/components/ui/use-toast"

const CallbackRequest = () => {
  const [showCallbackForm, setShowCallbackForm] = useState(false)
  const [callbackReason, setCallbackReason] = useState("")
  const { toast } = useToast()

  const handleCallbackRequest = () => {
    if (callbackReason.trim().length < 10) {
      toast({
        title: "Erreur",
        description: "Veuillez décrire la raison de votre demande (minimum 10 caractères)",
        variant: "destructive",
      })
      return
    }

    toast({
      title: "Demande envoyée",
      description: "Nous vous recontacterons dans les plus brefs délais",
    })
    setShowCallbackForm(false)
    setCallbackReason("")
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Phone className="h-5 w-5" />
          Besoin d'être rappelé ?
        </CardTitle>
      </CardHeader>
      <CardContent>
        {!showCallbackForm ? (
          <Button onClick={() => setShowCallbackForm(true)}>
            Demander à être rappelé
          </Button>
        ) : (
          <div className="space-y-4">
            <Textarea
              placeholder="Décrivez brièvement la raison de votre demande..."
              value={callbackReason}
              onChange={(e) => setCallbackReason(e.target.value)}
              className="min-h-[100px]"
            />
            <div className="flex gap-2">
              <Button onClick={handleCallbackRequest}>
                Envoyer la demande
              </Button>
              <Button 
                variant="outline" 
                onClick={() => {
                  setShowCallbackForm(false)
                  setCallbackReason("")
                }}
              >
                Annuler
              </Button>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  )
}

export default CallbackRequest