import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { supabase } from "@/integrations/supabase/client"
import { useToast } from "@/hooks/use-toast"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Phone } from "lucide-react"
import { CallbackRequestCard } from "./CallbackRequestCard"

export const CallbackRequestsList = () => {
  const { toast } = useToast()
  const queryClient = useQueryClient()

  const { data: callbackRequests } = useQuery({
    queryKey: ['callback-requests'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('callback_requests')
        .select(`
          *,
          profiles:client_id(first_name, last_name),
          studies(title)
        `)
        .eq('status', 'pending')
        .order('created_at', { ascending: false })

      if (error) throw error
      return data
    },
  })

  const markCallCompleted = useMutation({
    mutationFn: async (requestId: string) => {
      const { data, error } = await supabase
        .from('callback_requests')
        .update({ 
          status: 'completed',
          completed_at: new Date().toISOString()
        })
        .eq('id', requestId)
        .select()

      if (error) throw error
      return data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['callback-requests'] })
      toast({
        title: "Appel marqué comme effectué",
        description: "Le statut a été mis à jour avec succès",
      })
    },
  })

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Phone className="h-5 w-5" />
          Demandes de rappel
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {callbackRequests?.length === 0 ? (
            <p className="text-muted-foreground">Aucune demande de rappel en attente</p>
          ) : (
            callbackRequests?.map((request) => (
              <CallbackRequestCard
                key={request.id}
                request={request}
                onComplete={(id) => markCallCompleted.mutate(id)}
              />
            ))
          )}
        </div>
      </CardContent>
    </Card>
  )
}