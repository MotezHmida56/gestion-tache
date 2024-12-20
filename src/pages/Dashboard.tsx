import { useState, useEffect } from "react";
import axios from "axios"; // Importer axios
import DashboardLayout from "@/components/DashboardLayout";
import { Card } from "@/components/ui/card";
import { GraduationCap, MessageSquare, Bookmark, Users } from "lucide-react";

const stats = [
  {
    title: "Profile",
    value: "",
    icon: GraduationCap,
    color: "bg-blue-50",
    iconColor: "text-blue-500",
  },
  {
    title: "Chat",
    value: "",
    icon: MessageSquare,
    color: "bg-yellow-50",
    iconColor: "text-yellow-500",
  },
  {
    title: "Project",
    value: "", // Valeur dynamique ici
    icon: Bookmark,
    color: "bg-pink-50",
    iconColor: "text-pink-500",
  },
  {
    title: "Team Members",
    value: "", // Valeur dynamique ici
    icon: Users,
    color: "bg-orange-50",
    iconColor: "text-orange-500",
  },
];

const Dashboard = () => {
  const [projectCount, setProjectCount] = useState<string>(""); // Compteur de projets
  const [teamMemberCount, setTeamMemberCount] = useState<string>(""); // Compteur de membres

  // Effet pour récupérer le nombre de projets et de membres d'équipe
  useEffect(() => {
    const fetchStats = async () => {
      try {
        // Remplacez les URL par les vraies API que vous utilisez pour récupérer ces informations
        const projectsResponse = await axios.get("http://localhost:8080/projet/count");
        const teamMembersResponse = await axios.get("http://localhost:8080/User/count");


        if (projectsResponse.status === 200 && teamMembersResponse.status === 200) {
          const projectsData = projectsResponse.data;
          const teamMembersData = teamMembersResponse.data;

          setProjectCount(projectsData); // Met à jour le nombre de projets
          setTeamMemberCount(teamMembersData); // Met à jour le nombre de membres d'équipe
        } else {
          console.error("Failed to fetch project or team data");
        }
      } catch (error) {
        console.error("Error fetching stats:", error);
      }
    };

    fetchStats();
  }, []); // Exécuter au montage du composant

  // Mettez à jour les données dans l'array stats avec les valeurs récupérées
  const updatedStats = stats.map((stat) => {
    if (stat.title === "Project") {
      return { ...stat, value: projectCount };
    } else if (stat.title === "Team Members") {
      return { ...stat, value: teamMemberCount };
    }
    return stat;
  });

  return (
    <DashboardLayout>
      <div className="space-y-8">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900">Dashboard</h1>
          <p className="text-sm text-muted-foreground mt-1">
            Welcome back to your dashboard
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {updatedStats.map((stat) => (
            <Card key={stat.title} className="p-6">
              <div className="flex items-center gap-4">
                <div className={`${stat.color} p-3 rounded-lg`}>
                  <stat.icon className={`h-6 w-6 ${stat.iconColor}`} />
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">
                    {stat.title}
                  </p>
                  <p className="text-2xl font-semibold">{stat.value}</p>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </DashboardLayout>
  );
};

export default Dashboard;
