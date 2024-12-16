import { useQuery } from "@tanstack/react-query"
import { supabase } from "@/integrations/supabase/client"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { useNavigate } from "react-router-dom"
import { Eye } from "lucide-react"

const CurrentStudies = () => {
  const navigate = useNavigate()

  const { data: studies, isLoading } = useQuery({
    queryKey: ['member-studies'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('studies')
        .select(`
          *,
          client:profiles!studies_client_id_fkey(
            id,
            first_name,
            last_name,
            email
          ),
          assigned_member:profiles!studies_assigned_member_id_fkey(
            id,
            first_name,
            last_name,
            email
          )
        `)
        .order('created_at', { ascending: false })

      if (error) throw error
      return data
    },
  })

  if (isLoading) {
    return <div>Chargement des études...</div>
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Études en cours</h2>
        <Button onClick={() => navigate("/member/studies/new")}>
          Nouvelle étude
        </Button>
      </div>

      <div className="grid gap-6">
        {studies?.map((study) => (
          <Card key={study.id}>
            <CardHeader>
              <div className="flex justify-between items-start">
                <CardTitle>{study.title}</CardTitle>
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => navigate(`/member/current-studies/${study.id}`)}
                  >
                    <Eye className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <p className="text-muted-foreground">{study.description}</p>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="font-medium">Client</p>
                    <p className="text-sm text-muted-foreground">
                      {study.client ? `${study.client.first_name} ${study.client.last_name}` : 'Non assigné'}
                    </p>
                  </div>
                  <div>
                    <p className="font-medium">Chargé de projet</p>
                    <p className="text-sm text-muted-foreground">
                      {study.assigned_member 
                        ? `${study.assigned_member.first_name} ${study.assigned_member.last_name}` 
                        : 'Non assigné'}
                    </p>
                  </div>
                  <div>
                    <p className="font-medium">Budget</p>
                    <p className="text-sm text-muted-foreground">
                      {study.budget ? `${study.budget}€` : 'Non défini'}
                    </p>
                  </div>
                  <div>
                    <p className="font-medium">Statut</p>
                    <p className={`text-sm px-2 py-1 rounded-full inline-block ${
                      study.status === 'pending'
                        ? 'bg-yellow-100 text-yellow-800'
                        : study.status === 'in_progress'
                        ? 'bg-blue-100 text-blue-800'
                        : 'bg-green-100 text-green-800'
                    }`}>
                      {study.status === 'pending'
                        ? 'En attente'
                        : study.status === 'in_progress'
                        ? 'En cours'
                        : 'Terminée'}
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}

        {studies?.length === 0 && (
          <Card>
            <CardContent className="py-8">
              <p className="text-center text-muted-foreground">
                Aucune étude en cours
              </p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}

export default CurrentStudies