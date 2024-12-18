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
    staleTime: 30000, // Consider data fresh for 30 seconds
    gcTime: 5 * 60 * 1000, // Keep data in cache for 5 minutes
  })
}