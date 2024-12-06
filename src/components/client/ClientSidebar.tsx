import { Link, useLocation } from "react-router-dom";
import {
  BarChart,
  FileText,
  Calendar,
  Settings,
  MessageSquare,
  ClipboardList,
  AlertCircle,
} from "lucide-react";
import LogoutButton from "../auth/LogoutButton";

const ClientSidebar = () => {
  const location = useLocation();
  const isActive = (path: string) => location.pathname === path;

  const menuItems = [
    {
      title: "Vue d'ensemble",
      icon: BarChart,
      path: "/client",
    },
    {
      title: "Mon étude",
      icon: ClipboardList,
      path: "/client/study",
    },
    {
      title: "Documents",
      icon: FileText,
      path: "/client/documents",
    },
    {
      title: "Rendez-vous",
      icon: Calendar,
      path: "/client/appointments",
    },
    {
      title: "Messages",
      icon: MessageSquare,
      path: "/client/messages",
    },
    {
      title: "Alertes",
      icon: AlertCircle,
      path: "/client/alerts",
    },
    {
      title: "Paramètres",
      icon: Settings,
      path: "/client/settings",
    },
  ];

  return (
    <div className="h-screen w-64 bg-white border-r flex flex-col">
      <div className="p-6">
        <h2 className="text-xl font-bold text-gray-800">Espace Client</h2>
      </div>
      <nav className="flex-1 px-4">
        <ul className="space-y-2">
          {menuItems.map((item) => (
            <li key={item.path}>
              <Link
                to={item.path}
                className={`flex items-center px-4 py-2 rounded-lg transition-colors ${
                  isActive(item.path)
                    ? "bg-blue-50 text-blue-600"
                    : "text-gray-600 hover:bg-gray-50"
                }`}
              >
                <item.icon className="w-5 h-5 mr-3" />
                {item.title}
              </Link>
            </li>
          ))}
        </ul>
      </nav>
      <div className="p-4 border-t">
        <LogoutButton />
      </div>
    </div>
  );
};

export default ClientSidebar;