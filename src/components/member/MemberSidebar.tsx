import {
  Users,
  UserCog,
  Briefcase,
  Link,
  FolderOpen,
  Building2,
  Calendar,
  BookOpen,
  Target,
  ClipboardList,
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
    title: "Gestion des accès",
    icon: UserCog,
    path: "/member/access-management",
  },
  {
    title: "Offres de missions",
    icon: Briefcase,
    path: "/member/missions",
  },
  {
    title: "Intranet commun",
    icon: Link,
    path: "/member/common-intranet",
  },
  {
    title: "Intranet Junior",
    icon: FolderOpen,
    path: "/member/junior-intranet",
  },
  {
    title: "Espace groupe",
    icon: Building2,
    path: "/member/group-space",
  },
  {
    title: "Études en cours",
    icon: ClipboardList,
    path: "/member/current-studies",
  },
  {
    title: "Calendrier",
    icon: Calendar,
    path: "/member/calendar",
  },
  {
    title: "Objectifs",
    icon: Target,
    path: "/member/objectives",
  },
  {
    title: "Book de passation",
    icon: BookOpen,
    path: "/member/handover",
  },
];

const MemberSidebar = () => {
  const location = useLocation();
  const navigate = useNavigate();

  return (
    <Sidebar>
      <SidebarHeader className="p-4">
        <h2 className="text-lg font-semibold text-sidebar-primary">
          Espace Membre
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

export default MemberSidebar;