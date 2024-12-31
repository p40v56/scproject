import React from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { BarChart3, Users, FileText, TrendingUp, Phone } from "lucide-react"
import { cn } from "@/lib/utils"
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { supabase } from "@/integrations/supabase/client"
import { Button } from "@/components/ui/button"
import { useToast } from "@/hooks/use-toast"

const stats = [
  {
    title: "Études en cours",
    value: "12",
    icon: FileText,
    trend: "+2 ce mois",
    color: "text-blue-600",
  },
  {
    title: "Chargés d'études",
    value: "24",
    icon: Users,
    trend: "+4 ce mois",
    color: "text-green-600",
  },
  {
    title: "Chiffre d'affaires",
    value: "45K€",
    icon: TrendingUp,
    trend: "+12% vs n-1",
    color: "text-purple-600",
  },
  {
    title: "Taux de satisfaction",
    value: "98%",
    icon: BarChart3,
    trend: "+2pts vs n-1",
    color: "text-orange-600",
  },
]

const Overview = () => {
  const { toast } = useToast()
  const queryClient = useQueryClient()

  const { data: callbackRequests } = useQuery({
    queryKey: ['callback-requests'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('callback_requests')
        .select(`
          *,
          profiles:client_id(first_name, last_name)
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

  const formatDate = (date: string) => {
    return new Date(date).toLocaleString('fr-FR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  return (
    <div className="space-y-8">
      <h1 className="text-2xl font-bold">Vue d'ensemble</h1>
      
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => (
          <Card key={stat.title}>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                {stat.title}
              </CardTitle>
              <stat.icon className={cn("w-4 h-4", stat.color)} />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stat.value}</div>
              <p className="text-xs text-muted-foreground">{stat.trend}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Études récentes</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {[1, 2, 3].map((i) => (
                <div key={i} className="flex items-center gap-4">
                  <div className="w-2 h-2 bg-blue-600 rounded-full" />
                  <div>
                    <p className="font-medium">Étude {i}</p>
                    <p className="text-sm text-muted-foreground">Client {i}</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

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
                  <div key={request.id} className="flex items-start justify-between gap-4 p-4 bg-muted rounded-lg">
                    <div className="space-y-1">
                      <p className="font-medium">
                        {request.profiles?.first_name} {request.profiles?.last_name}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        Demande du {formatDate(request.created_at)}
                      </p>
                      <p className="text-sm mt-2">{request.reason}</p>
                    </div>
                    <Button 
                      size="sm"
                      onClick={() => markCallCompleted.mutate(request.id)}
                    >
                      Marquer comme effectué
                    </Button>
                  </div>
                ))
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

export default Overview