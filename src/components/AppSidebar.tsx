import { Home, Users, Folder, UserCircle, MessageSquare, LogOut } from "lucide-react";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import { Link, useNavigate } from "react-router-dom";

const menuItems = [
  { icon: Home, label: "Home", href: "/dashboard" },
  { icon: Users, label: "Team Members", href: "/team" },
  { icon: UserCircle, label: "Profile", href: "/profile" },
  { icon: Folder, label: "Projects", href: "/projects" },
  { icon: MessageSquare, label: "Chat", href: "/chat" },
];

export function AppSidebar() {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("token"); // Supprimer le token (exemple pour gérer l'authentification)
    navigate("/sign-in"); // Redirection vers la page Sign In
  };

  return (
    <Sidebar>
      <SidebarContent>
        <div className="p-4">
          <div className="flex flex-col items-center gap-2">
            <img
              src="/lovable-uploads/touhaa.jpg"
              alt="Profile"
              className="w-20 h-20 rounded-full"
            />
            <h2 className="text-lg font-semibold">Anis Touhami</h2>
            <span className="text-sm text-primary">Member</span>
          </div>
        </div>
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu>
              {menuItems.map((item) => (
                <SidebarMenuItem key={item.label}>
                  <SidebarMenuButton asChild>
                    <Link to={item.href} className="flex items-center gap-2">
                      <item.icon className="h-5 w-5" />
                      <span>{item.label}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
        <div className="mt-auto p-4">
          <SidebarMenuButton className="w-full" asChild>
            <button onClick={handleLogout} className="flex items-center gap-2">
              <LogOut className="h-5 w-5" />
              <span>Logout</span>
            </button>
          </SidebarMenuButton>
        </div>
      </SidebarContent>
    </Sidebar>
  );
}
