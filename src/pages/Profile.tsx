import { useState, useEffect } from "react";
import DashboardLayout from "@/components/DashboardLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Check } from "lucide-react";
import axios from "axios"; // Importer axios pour les requêtes API

const Profile = () => {
  const userId = localStorage.getItem("userId"); // Récupérer l'ID utilisateur stocké dans localStorage
  const [formData, setFormData] = useState({
    username: "",
    telephone: "",
    oldPassword: "",
    newPassword: "",
    photoPath: "",
  });

  // Récupérer les données de l'utilisateur lors du montage du composant
  useEffect(() => {
    if (userId) {
      // Effectuer une requête pour récupérer les données de l'utilisateur
      axios
        .get(`http://localhost:8080/User/${userId}`) // Adaptez l'URL de votre API
        .then((response) => {
          const { username, telephone, photoPath } = response.data;
          setFormData({
            ...formData,
            username,
            telephone,
            photoPath,
          });
        })
        .catch((error) => {
          console.error("Erreur lors de la récupération des données utilisateur:", error);
        });
    }
  }, [userId]); // Recharger les données si l'ID utilisateur change

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Profile update attempt with:", formData);

    // Vérification si les données ont été modifiées
    const updateData = {
      username: formData.username,
      telephone: formData.telephone,
      photoPath: formData.photoPath,
      
    };

    // Si un nouveau mot de passe a été spécifié, l'ajouter à la requête
    if (formData.newPassword && formData.newPassword !== formData.oldPassword) {
      formData.oldPassword = formData.newPassword; // Vous pouvez aussi appliquer un encodage de mot de passe ici si nécessaire
    }

    // Si les informations ont été modifiées, les envoyer à l'API
    axios
      .put(`http://localhost:8080/User/update/${userId}`, updateData) // Utilisez une requête PUT pour mettre à jour
      .then((response) => {
        console.log("Profile successfully updated:", response);
        // Ajouter un toast ou une notification pour informer l'utilisateur du succès
      })
      .catch((error) => {
        console.error("Erreur lors de la mise à jour du profil:", error);
        // Ajouter un toast ou une notification pour informer de l'échec
      });
  };

  return (
    <DashboardLayout>
      <div className="max-w-2xl mx-auto space-y-8">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900">Edit Profile</h1>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <label htmlFor="username" className="text-sm font-medium">
              Username
            </label>
            <Input
              id="username"
              name="username"
              value={formData.username}
              onChange={handleChange}
            />
          </div>

          <div className="space-y-2">
            <label htmlFor="telephone" className="text-sm font-medium">
              Telephone
            </label>
            <Input
              id="telephone"
              name="telephone"
              value={formData.telephone}
              onChange={handleChange}
            />
          </div>

          <div className="space-y-2">
            <label htmlFor="oldPassword" className="text-sm font-medium">
              Old Password
            </label>
            <div className="relative">
              <Input
                id="oldPassword"
                name="oldPassword"
                type="password"
                value={formData.oldPassword}
                onChange={handleChange}
              />
              <Check className="absolute right-3 top-1/2 -translate-y-1/2 h-5 w-5 text-green-500" />
            </div>
          </div>

          <div className="space-y-2">
            <label htmlFor="newPassword" className="text-sm font-medium">
              New Password
            </label>
            <Input
              id="newPassword"
              name="newPassword"
              type="password"
              value={formData.newPassword}
              onChange={handleChange}
            />
          </div>

          <div className="space-y-2">
            <label htmlFor="photoPath" className="text-sm font-medium">
              Photo URL
            </label>
            <Input
              id="photoPath"
              name="photoPath"
              value={formData.photoPath}
              onChange={handleChange}
            />
          </div>

          <div className="flex gap-4">
            <Button type="button" variant="outline">
              Cancel
            </Button>
            <Button type="submit">Save</Button>
          </div>
        </form>
      </div>
    </DashboardLayout>
  );
};

export default Profile;
