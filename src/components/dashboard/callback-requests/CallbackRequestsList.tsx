import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { useEffect } from "react"
import { supabase } from "@/integrations/supabase/client"
import { useToast } from "@/hooks/use-toast"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Phone } from "lucide-react"
import { CallbackRequestCard } from "./CallbackRequestCard"

export const CallbackRequestsList = () => {
  const { toast } = useToast()
  const queryClient = useQueryClient()

  const { data: callbackRequests, isLoading } = useQuery({
    queryKey: ['callback-requests'],
    queryFn: async () => {
      console.log("Fetching callback requests...")
      const { data, error } = await supabase
        .from('callback_requests')
        .select(`
          *,
          profiles:client_id(first_name, last_name),
          studies(title)
        `)
        .eq('status', 'pending')
        .order('created_at', { ascending: false })

      if (error) {
        console.error("Error fetching callback requests:", error)
        throw error
      }
      
      console.log("Callback requests data:", data)
      return data
    },
  })

  // Set up real-time subscription
  useEffect(() => {
    console.log("Setting up real-time subscription for callback requests")
    const channel = supabase
      .channel('callback-requests-changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'callback_requests'
        },
        (payload) => {
          console.log("Received real-time update:", payload)
          queryClient.invalidateQueries({ queryKey: ['callback-requests'] })
        }
      )
      .subscribe()

    return () => {
      console.log("Cleaning up real-time subscription")
      supabase.removeChannel(channel)
    }
  }, [queryClient])

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

  if (isLoading) {
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
            <p className="text-muted-foreground">Chargement...</p>
          </div>
        </CardContent>
      </Card>
    )
  }

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
          {!callbackRequests || callbackRequests.length === 0 ? (
            <p className="text-muted-foreground">Aucune demande de rappel en attente</p>
          ) : (
            callbackRequests.map((request) => (
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