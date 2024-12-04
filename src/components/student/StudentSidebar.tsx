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

const menuItems = [
  {
    title: "Profil",
    icon: User,
    href: "#profile",
  },
  {
    title: "Documents",
    icon: FileText,
    href: "#documents",
  },
  {
    title: "Missions disponibles",
    icon: Briefcase,
    href: "#missions",
  },
  {
    title: "Études en cours",
    icon: BookOpen,
    href: "#current-studies",
  },
  {
    title: "Études finies",
    icon: Book,
    href: "#completed-studies",
  },
];

const StudentSidebar = () => {
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
                className="group transition-all duration-200 hover:bg-sidebar-accent"
              >
                <a
                  href={item.href}
                  className="flex items-center gap-3 px-4 py-2 rounded-md"
                >
                  <item.icon className="w-5 h-5 transition-transform duration-200 group-hover:scale-110" />
                  <span className="font-medium">{item.title}</span>
                </a>
              </SidebarMenuButton>
            </SidebarMenuItem>
          ))}
        </SidebarMenu>
      </SidebarContent>
    </Sidebar>
  );
};

export default StudentSidebar;