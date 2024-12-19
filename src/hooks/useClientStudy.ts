import { useQuery } from "@tanstack/react-query"
import { supabase } from "@/integrations/supabase/client"
import { useAuth } from "@/components/auth/AuthProvider"

export const useClientStudy = () => {
  const { session } = useAuth()

  return useQuery({
    queryKey: ['client-study', session?.user?.id],
    queryFn: async () => {
      if (!session?.user?.id) {
        throw new Error("User not authenticated")
      }

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
        .eq('client_id', session.user.id)
        .maybeSingle()

      if (error) {
        console.error("Error fetching study:", error)
        throw error
      }
      
      return data
    },
    enabled: !!session?.user?.id,
    staleTime: 5 * 60 * 1000, // Data considered fresh for 5 minutes
    gcTime: 10 * 60 * 1000, // Keep in cache for 10 minutes
    refetchOnWindowFocus: false,
    refetchOnMount: false,
  })
}