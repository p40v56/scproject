import {
  Users,
  BookOpen,
  FileText,
  DollarSign,
  Calendar,
  MessageSquare,
  ChartBar,
  Trophy,
} from "lucide-react";
import { useLocation, useNavigate } from "react-router-dom";
import {
  Sidebar,
  SidebarContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import LogoutButton from "../auth/LogoutButton";

const menuItems = [
  {
    title: "Vue d'ensemble",
    icon: ChartBar,
    path: "/alumni/dashboard",
  },
  {
    title: "Blog & Actualités",
    icon: BookOpen,
    path: "/alumni/blog",
  },
  {
    title: "Répertoire Alumni",
    icon: Users,
    path: "/alumni/directory",
  },
  {
    title: "Archives",
    icon: FileText,
    path: "/alumni/archives",
  },
  {
    title: "Événements",
    icon: Calendar,
    path: "/alumni/events",
  },
  {
    title: "Comité Senior",
    icon: Trophy,
    path: "/alumni/senior-committee",
  },
  {
    title: "Faire un don",
    icon: DollarSign,
    path: "/alumni/donate",
  },
  {
    title: "Contact",
    icon: MessageSquare,
    path: "/alumni/contact",
  },
];

const AlumniSidebar = () => {
  const location = useLocation();
  const navigate = useNavigate();

  return (
    <Sidebar>
      <SidebarHeader className="p-4">
        <h2 className="text-lg font-semibold text-sidebar-primary">
          Espace Alumni
        </h2>
      </SidebarHeader>
      <SidebarContent>
        <SidebarMenu>
          {menuItems.map((item) => (
            <SidebarMenuItem key={item.path}>
              <SidebarMenuButton
                asChild
                className="w-full"
                onClick={() => navigate(item.path)}
              >
                <button
                  className={`flex items-center gap-3 w-full px-4 py-2 rounded-md transition-colors duration-200 hover:bg-sidebar-accent hover:text-sidebar-accent-foreground group ${
                    location.pathname === item.path
                      ? "bg-sidebar-accent text-sidebar-accent-foreground"
                      : ""
                  }`}
                >
                  <item.icon className="w-5 h-5 transition-transform duration-200 group-hover:scale-110" />
                  <span className="font-medium">{item.title}</span>
                </button>
              </SidebarMenuButton>
            </SidebarMenuItem>
          ))}
        </SidebarMenu>
      </SidebarContent>
      <div className="mt-auto p-4 border-t">
        <LogoutButton />
      </div>
    </Sidebar>
  );
};

export default AlumniSidebar;