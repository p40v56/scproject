import { useQuery } from "@tanstack/react-query"
import { supabase } from "@/integrations/supabase/client"
import { useAuth } from "@/components/auth/AuthProvider"

export const useClientStudy = () => {
  const { session } = useAuth()

  return useQuery({
    queryKey: ['client-study'],
    queryFn: async () => {
      console.log("Fetching study for client:", session?.user?.id)

      const { data, error } = await supabase
        .from('studies')
        .select(`
          *,
          assigned_member:profiles!studies_assigned_member_id_fkey(
            id,
            first_name,
            last_name,
            email
          ),
          study_phases(
            id,
            name,
            status,
            progress,
            order
          ),
          study_meetings(
            id,
            title,
            date,
            status
          )
        `)
        .eq('client_id', session?.user?.id)
        .maybeSingle()

      if (error) {
        console.error("Error fetching study:", error)
        throw error
      }
      
      console.log("Fetched study data:", data)
      return data
    },
    enabled: !!session?.user?.id,
    staleTime: 30000, // Les données sont considérées comme fraîches pendant 30 secondes
    gcTime: 5 * 60 * 1000, // Garde les données en cache pendant 5 minutes
    refetchOnWindowFocus: false, // Évite les rechargements inutiles
  })
}