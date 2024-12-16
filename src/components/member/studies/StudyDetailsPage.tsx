import { useParams } from "react-router-dom"
import { useQuery } from "@tanstack/react-query"
import { supabase } from "@/integrations/supabase/client"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import StudyDocumentsSection from "./StudyDocumentsSection"
import StudyPhasesSection from "./StudyPhasesSection"
import StudyMeetingsSection from "./StudyMeetingsSection"
import { Button } from "@/components/ui/button"
import { useNavigate } from "react-router-dom"
import { Card, CardContent } from "@/components/ui/card"

const StudyDetailsPage = () => {
  const { studyId } = useParams()
  const navigate = useNavigate()

  const { data: study, isLoading } = useQuery({
    queryKey: ['study', studyId],
    queryFn: async () => {
      console.log("Fetching study with ID:", studyId)
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
        .eq('id', studyId)
        .single()

      if (error) {
        console.error("Error fetching study:", error)
        throw error
      }
      console.log("Fetched study data:", data)
      return data
    },
  })

  if (isLoading) {
    return <div>Chargement...</div>
  }

  if (!study) {
    return <div>Étude non trouvée</div>
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">{study.title}</h1>
        <Button variant="outline" onClick={() => navigate('/member/current-studies')}>
          Retour
        </Button>
      </div>

      <Tabs defaultValue="overview" className="space-y-4">
        <TabsList>
          <TabsTrigger value="overview">Vue d'ensemble</TabsTrigger>
          <TabsTrigger value="documents">Documents</TabsTrigger>
          <TabsTrigger value="phases">Phases & Avancement</TabsTrigger>
          <TabsTrigger value="meetings">Rendez-vous</TabsTrigger>
        </TabsList>

        <TabsContent value="overview">
          <div className="grid gap-6">
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              <Card>
                <CardContent className="pt-6">
                  <h3 className="font-medium mb-2">Client</h3>
                  <p className="text-sm text-muted-foreground">
                    {study.client ? `${study.client.first_name} ${study.client.last_name}` : 'Non assigné'}
                  </p>
                  {study.client?.email && (
                    <p className="text-sm text-muted-foreground">{study.client.email}</p>
                  )}
                </CardContent>
              </Card>

              <Card>
                <CardContent className="pt-6">
                  <h3 className="font-medium mb-2">Chargé de projet</h3>
                  <p className="text-sm text-muted-foreground">
                    {study.assigned_member ? `${study.assigned_member.first_name} ${study.assigned_member.last_name}` : 'Non assigné'}
                  </p>
                  {study.assigned_member?.email && (
                    <p className="text-sm text-muted-foreground">{study.assigned_member.email}</p>
                  )}
                </CardContent>
              </Card>

              <Card>
                <CardContent className="pt-6">
                  <h3 className="font-medium mb-2">Budget</h3>
                  <p className="text-sm text-muted-foreground">
                    {study.budget ? `${study.budget}€` : 'Non défini'}
                  </p>
                </CardContent>
              </Card>
            </div>

            <Card>
              <CardContent className="pt-6">
                <h3 className="font-medium mb-2">Description</h3>
                <p className="text-sm text-muted-foreground">
                  {study.description || 'Aucune description'}
                </p>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="documents">
          <StudyDocumentsSection studyId={study.id} />
        </TabsContent>

        <TabsContent value="phases">
          <StudyPhasesSection studyId={study.id} />
        </TabsContent>

        <TabsContent value="meetings">
          <StudyMeetingsSection studyId={study.id} />
        </TabsContent>
      </Tabs>
    </div>
  )
}

export default StudyDetailsPage