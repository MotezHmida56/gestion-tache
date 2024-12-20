import { useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { UserPlus } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";

// URL de base pour l'API
const API_URL = "http://localhost:8080/";
const api = axios.create({
  baseURL: API_URL,
  headers: {
    "Content-Type": "application/json", // Par défaut pour JSON
  },
});

const SignUp = () => {
  const [formData, setFormData] = useState({
    username: "",
    telephone: "",
    password: "",
  });
  const [photo, setPhoto] = useState<File | null>(null);
  
  const { toast } = useToast();

  // Fonction de soumission du formulaire
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Vérifier que tous les champs sont remplis
    if (!formData.username || !formData.telephone || !formData.password) {
      toast({
        title: "Missing Fields",
        description: "Please complete all fields before submitting.",
        variant: "destructive",
      });
      return;
    }

    // Préparation des données FormData (support pour les fichiers)
    const data = new FormData();
    data.append("username", formData.username);
    data.append("telephone", formData.telephone);
    data.append("password", formData.password);
    if (photo) {
      data.append("photo", photo);
    }

    try {
      // Affichage d'un message toast pendant l'opération de création du compte
      toast({
        title: "Creating account...",
        description: "Please wait while we set up your account.",
      });

      // Requête POST via axios instance
      const response = await api.post("/User/add", data, {
        headers: {
          "Content-Type": "multipart/form-data", // Nécessaire pour FormData
        },
      });

      // Affichage de succès
      toast({
        title: "Account created successfully!",
        description: response.data,
      });

      console.log("Account created:", response.data);
    } catch (error: any) {
      // Gestion des erreurs
      const errorMessage = error.response?.data?.message || "An error occurred. Please try again.";
      toast({
        title: "Error creating account",
        description: errorMessage,
        variant: "destructive",
      });
      console.error("Error creating account:", errorMessage);
    }
  };

  // Gestion de la saisie dans le formulaire
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  // Gestion du changement de fichier (photo)
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setPhoto(e.target.files[0]);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div>
          <h2 className="mt-6 text-center text-3xl font-bold text-gray-900">
            Create your account
          </h2>
        </div>
        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div className="rounded-md shadow-sm space-y-4">
            {/* Input pour username */}
            <div>
              <label htmlFor="username" className="sr-only">Username</label>
              <Input
                id="username"
                name="username"
                type="text"
                required
                value={formData.username}
                onChange={handleChange}
                placeholder="Username"
              />
            </div>

            {/* Input pour téléphone */}
            <div>
              <label htmlFor="telephone" className="sr-only">Telephone</label>
              <Input
                id="telephone"
                name="telephone"
                type="text"
                required
                value={formData.telephone}
                onChange={handleChange}
                placeholder="Telephone"
              />
            </div>

            {/* Input pour mot de passe */}
            <div>
              <label htmlFor="password" className="sr-only">Password</label>
              <Input
                id="password"
                name="password"
                type="password"
                required
                value={formData.password}
                onChange={handleChange}
                placeholder="Password"
              />
            </div>

            {/* Input pour photo */}
           
          </div>

          <div>
            <Button type="submit" className="w-full">
              <UserPlus className="mr-2 h-4 w-4" />
              Sign up
            </Button>
          </div>

          <div className="text-sm text-center">
            <Link to="/sign-in" className="font-medium text-primary hover:text-primary/80">
              Already have an account? Sign in
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
};

export default SignUp;
