import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Phone } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { supabase } from "@/integrations/supabase/client"
import { useAuth } from "@/components/auth/AuthProvider"
import { useClientStudy } from "@/hooks/useClientStudy"

const CallbackRequest = () => {
  const [showCallbackForm, setShowCallbackForm] = useState(false)
  const [callbackReason, setCallbackReason] = useState("")
  const { toast } = useToast()
  const { session } = useAuth()
  const queryClient = useQueryClient()
  const { data: study } = useClientStudy()

  // Fetch latest callback request
  const { data: latestRequest, isLoading } = useQuery({
    queryKey: ['callback-request', session?.user?.id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('callback_requests')
        .select(`
          *,
          studies (
            title
          )
        `)
        .eq('client_id', session?.user?.id)
        .order('created_at', { ascending: false })
        .limit(1)
        .single()

      if (error) throw error
      return data
    },
    enabled: !!session?.user?.id,
  })

  const createCallbackRequest = useMutation({
    mutationFn: async () => {
      if (!study?.id) throw new Error("No study ID available")
      
      const { data, error } = await supabase
        .from('callback_requests')
        .insert([
          {
            client_id: session?.user?.id,
            study_id: study.id,
            reason: callbackReason,
            status: 'pending'
          }
        ])
        .select()

      if (error) throw error
      return data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['callback-request'] })
      toast({
        title: "Demande envoyée",
        description: "Nous vous recontacterons dans les plus brefs délais",
      })
      setShowCallbackForm(false)
      setCallbackReason("")
    },
    onError: () => {
      toast({
        title: "Erreur",
        description: "Une erreur est survenue lors de l'envoi de votre demande",
        variant: "destructive",
      })
    }
  })

  const handleCallbackRequest = () => {
    if (callbackReason.trim().length < 10) {
      toast({
        title: "Erreur",
        description: "Veuillez décrire la raison de votre demande (minimum 10 caractères)",
        variant: "destructive",
      })
      return
    }

    createCallbackRequest.mutate()
  }

  const formatDate = (date: string) => {
    return new Date(date).toLocaleString('fr-FR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  if (isLoading) {
    return <div>Chargement...</div>
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
        {latestRequest && latestRequest.status === 'pending' ? (
          <div className="space-y-4">
            <div className="bg-muted p-4 rounded-lg">
              <p className="font-medium">Demande de rappel en attente</p>
              <p className="text-sm text-muted-foreground">
                Le {formatDate(latestRequest.created_at)}
              </p>
              <p className="mt-2 text-sm">Raison : {latestRequest.reason}</p>
              {latestRequest.studies && (
                <p className="mt-1 text-sm text-muted-foreground">
                  Pour l'étude : {latestRequest.studies.title}
                </p>
              )}
            </div>
          </div>
        ) : (
          !showCallbackForm ? (
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
          )
        )}
      </CardContent>
    </Card>
  )
}

export default CallbackRequest