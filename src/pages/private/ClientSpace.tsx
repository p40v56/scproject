import { useEffect, useState } from "react"
import { Routes, Route } from "react-router-dom"
import ClientSidebar from "@/components/client/ClientSidebar"
import FirstLogin from "@/components/client/FirstLogin"
import Documents from "@/components/client/Documents"
import Appointments from "@/components/client/Appointments"
import StudyDetails from "@/components/client/StudyDetails"
import Settings from "@/components/client/Settings"
import { SidebarProvider } from "@/components/ui/sidebar"
import { useQuery } from "@tanstack/react-query"
import { supabase } from "@/integrations/supabase/client"
import { useAuth } from "@/components/auth/AuthProvider"

const ClientSpace = () => {
  const [showFirstLogin, setShowFirstLogin] = useState<boolean | null>(null)
  const { session } = useAuth()

  const { data: profile } = useQuery({
    queryKey: ['client-profile', session?.user?.id],
    queryFn: async () => {
      if (!session?.user?.id) return null
      
      const { data, error } = await supabase
        .from('profiles')
        .select('membership_paid_date')
        .eq('id', session.user.id)
        .maybeSingle()

      if (error) throw error
      return data
    },
    enabled: !!session?.user?.id,
  })

  useEffect(() => {
    if (profile) {
      setShowFirstLogin(!profile.membership_paid_date)
    }
  }, [profile])

  if (showFirstLogin === null) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p className="text-muted-foreground">Chargement...</p>
      </div>
    )
  }

  if (showFirstLogin) {
    return <FirstLogin onComplete={() => setShowFirstLogin(false)} />
  }

  return (
    <SidebarProvider>
      <div className="flex min-h-screen w-full">
        <ClientSidebar />
        <main className="flex-1 p-6">
          <Routes>
            <Route path="/" element={<StudyDetails />} />
            <Route path="/study" element={<StudyDetails />} />
            <Route path="/documents" element={<Documents />} />
            <Route path="/appointments" element={<Appointments />} />
            <Route path="/settings" element={<Settings />} />
          </Routes>
        </main>
      </div>
    </SidebarProvider>
  )
}

export default ClientSpace