import React from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import {
  BarChart3,
  Users,
  FileText,
  CreditCard,
  Settings,
  FolderOpen,
} from "lucide-react"
import { cn } from "@/lib/utils"

const menuItems = [
  { icon: BarChart3, label: "Vue d'ensemble", href: "#overview" },
  { icon: Users, label: "Utilisateurs", href: "#users" },
  { icon: FileText, label: "Études", href: "#studies" },
  { icon: CreditCard, label: "Paiements", href: "#payments" },
  { icon: FolderOpen, label: "Documents", href: "#documents" },
  { icon: Settings, label: "Paramètres", href: "#settings" },
]

const DashboardLayout = ({ children }: { children: React.ReactNode }) => {
  const [activeSection, setActiveSection] = React.useState("#overview")

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="flex">
        {/* Sidebar */}
        <aside className="w-64 min-h-screen bg-white border-r">
          <div className="p-6">
            <h2 className="text-xl font-bold text-blue-600">Dashboard</h2>
          </div>
          <nav className="px-4 space-y-2">
            {menuItems.map((item) => (
              <Button
                key={item.href}
                variant="ghost"
                className={cn(
                  "w-full justify-start gap-2",
                  activeSection === item.href && "bg-blue-50 text-blue-600"
                )}
                onClick={() => setActiveSection(item.href)}
              >
                <item.icon className="w-4 h-4" />
                {item.label}
              </Button>
            ))}
          </nav>
        </aside>

        {/* Main Content */}
        <main className="flex-1 p-8">
          {children}
        </main>
      </div>
    </div>
  )
}

export default DashboardLayout