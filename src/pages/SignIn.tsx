import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { LogIn } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import axios from "axios"; // Assurez-vous d'avoir installé axios

const SignIn = () => {
  const [username, setUsername] = useState("");  // Utilisation de username à la place de email
  const [password, setPassword] = useState("");
  const { toast } = useToast();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Sign in attempt with:", { username, password });

    // Affichage du toast pour informer l'utilisateur que la demande est en cours
    toast({
      title: "Signing in...",
      description: "Please wait while we verify your credentials.",
    });

    try {
      // Requête POST à l'API de login
      const response = await axios.post("http://localhost:8080/User/login", {
        username: username, // Utilisation de username pour l'authentification
        password: password,
      });

      // Si la requête réussit, traiter la réponse et naviguer vers le tableau de bord
      if (response.status === 200) {
        const userId = response.data.userId; // Récupérer l'ID utilisateur depuis la réponse
        localStorage.setItem("userId", userId); // Sauvegarder l'ID dans localStorage
        
        toast({
          title: "Login successful",
          description: `Welcome back, ${response.data.username}!`, // Vous pouvez personnaliser le message ici
        });

        setTimeout(() => {
          navigate("/dashboard"); // Rediriger vers le tableau de bord après une petite pause
        }, 1000);
      }
    } catch (error) {
      // Si l'authentification échoue, traiter l'erreur et afficher un message d'erreur
      let errorMessage = "An unexpected error occurred."; // Message d'erreur par défaut
      if (axios.isAxiosError(error)) {
        if (error.response) {
          // Récupérer un message d'erreur structuré si disponible
          errorMessage = error.response?.data?.message || errorMessage;
        }
      } else {
        errorMessage = "An unknown error occurred.";
      }

      toast({
        title: "Login failed",
        description: errorMessage, // Afficher seulement un texte comme message
        variant: "destructive", // Optionnel : style pour signaler un échec
      });
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div>
          <h2 className="mt-6 text-center text-3xl font-bold text-gray-900">
            Sign in to your account
          </h2>
        </div>
        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div className="rounded-md shadow-sm space-y-4">
            <div>
              <label htmlFor="username" className="sr-only">
                Username
              </label>
              <Input
                id="username"
                name="username"  // Le champ name doit correspondre à "username"
                type="text"
                required
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Username"
              />
            </div>
            <div>
              <label htmlFor="password" className="sr-only">
                Password
              </label>
              <Input
                id="password"
                name="password"
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Password"
              />
            </div>
          </div>

          <div>
            <Button type="submit" className="w-full">
              <LogIn className="mr-2 h-4 w-4" />
              Sign in
            </Button>
          </div>

          <div className="text-sm text-center">
            <Link
              to="/signup"
              className="font-medium text-primary hover:text-primary/80"
            >
              Don't have an account? Sign up
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
};

export default SignIn;
