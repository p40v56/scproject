import { useEffect, useState } from "react"
import { Routes, Route } from "react-router-dom"
import ClientSidebar from "@/components/client/ClientSidebar"
import FirstLogin from "@/components/client/FirstLogin"
import Documents from "@/components/client/Documents"
import Appointments from "@/components/client/Appointments"
import StudyDetails from "@/components/client/StudyDetails"
import Messages from "@/components/client/Messages"
import Notifications from "@/components/client/Notifications"
import Settings from "@/components/client/Settings"
import { SidebarProvider } from "@/components/ui/sidebar"

const ClientSpace = () => {
  const [isFirstLogin, setIsFirstLogin] = useState(true)

  // Utiliser useEffect pour les mises à jour d'état
  useEffect(() => {
    // Ici vous pouvez ajouter la logique pour vérifier si c'est vraiment
    // la première connexion en vérifiant les données du profil par exemple
    setIsFirstLogin(false) // Pour l'instant, on désactive directement
  }, [])

  if (isFirstLogin) {
    return <FirstLogin onComplete={() => setIsFirstLogin(false)} />
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
            <Route path="/messages" element={<Messages />} />
            <Route path="/notifications" element={<Notifications />} />
            <Route path="/settings" element={<Settings />} />
          </Routes>
        </main>
      </div>
    </SidebarProvider>
  )
}

export default ClientSpace