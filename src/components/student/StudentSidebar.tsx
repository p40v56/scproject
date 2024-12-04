import {
  User,
  FileText,
  Briefcase,
  BookOpen,
  Book,
} from "lucide-react";
import {
  Sidebar,
  SidebarContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import { useNavigate } from "react-router-dom";

const menuItems = [
  {
    title: "Profil",
    icon: User,
    value: "profile",
  },
  {
    title: "Documents",
    icon: FileText,
    value: "documents",
  },
  {
    title: "Missions disponibles",
    icon: Briefcase,
    value: "missions",
  },
  {
    title: "Études en cours",
    icon: BookOpen,
    value: "current-studies",
  },
  {
    title: "Études finies",
    icon: Book,
    value: "completed-studies",
  },
];

const StudentSidebar = () => {
  const navigate = useNavigate();
  // Normally this would come from your auth context
  const studentName = "Jean Dupont";

  return (
    <Sidebar>
      <SidebarHeader className="p-4 space-y-2">
        <h2 className="text-lg font-semibold text-sidebar-primary">
          Tableau de bord étudiant
        </h2>
        <p className="text-sm text-sidebar-foreground/70">{studentName}</p>
      </SidebarHeader>
      <SidebarContent>
        <SidebarMenu>
          {menuItems.map((item) => (
            <SidebarMenuItem key={item.title}>
              <SidebarMenuButton
                asChild
                className="group transition-all duration-200 ease-in-out"
              >
                <button
                  onClick={() => navigate(`#${item.value}`)}
                  className="flex items-center gap-3 px-4 py-2 rounded-md w-full transition-colors duration-200 hover:bg-sidebar-accent hover:text-sidebar-accent-foreground group-data-[active=true]:bg-sidebar-accent group-data-[active=true]:text-sidebar-accent-foreground"
                >
                  <item.icon className="w-5 h-5 transition-transform duration-200 group-hover:scale-110" />
                  <span className="font-medium">{item.title}</span>
                </button>
              </SidebarMenuButton>
            </SidebarMenuItem>
          ))}
        </SidebarMenu>
      </SidebarContent>
    </Sidebar>
  );
};

export default StudentSidebar;