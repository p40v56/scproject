import { useParams } from "react-router-dom"
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { supabase } from "@/integrations/supabase/client"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import StudyDocumentsSection from "./StudyDocumentsSection"
import StudyPhasesSection from "./StudyPhasesSection"
import StudyMeetingsSection from "./StudyMeetingsSection"
import StudyOverviewSection from "./StudyOverviewSection"
import { toast } from "sonner"

const StudyDetailsPage = () => {
  const { studyId } = useParams()
  const queryClient = useQueryClient()

  const { data: study, isLoading } = useQuery({
    queryKey: ['studies', studyId],
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
        .eq('id', studyId)
        .single()

      if (error) throw error
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
        <Button variant="outline" onClick={() => window.history.back()}>
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
          <StudyOverviewSection study={study} />
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