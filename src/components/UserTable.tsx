import { useEffect, useState } from "react";
import axios from "axios";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

// Adaptation de User pour tenir compte des champs supplémentaires
type User = {
  id: number;
  username: string;
  telephone: string;
  photoPath: string;
};

export function UserTable() {
  const [users, setUsers] = useState<User[]>([]);

  // Fonction pour récupérer les utilisateurs avec axios
  const fetchUsers = async () => {
    try {
      const response = await axios.get("http://localhost:8080/User/all");
      setUsers(response.data);
    } catch (error) {
      console.error("Error fetching users:", error);
    }
  };

  // Appeler l'API à chaque fois que le composant est monté
  useEffect(() => {
    fetchUsers();
  }, []); // [] signifie que cet effet s'exécutera une seule fois lors du montage

  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Username</TableHead>
            <TableHead>Telephone</TableHead>
            <TableHead>Photo</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {users.map((user) => (
            <TableRow key={user.id}>
              <TableCell className="font-medium">{user.username}</TableCell>
              <TableCell>{user.telephone}</TableCell>
              <TableCell>
                {user.photoPath ? (
                  <img src={user.photoPath} alt="User photo" className="w-10 h-10 rounded-full" />
                ) : (
                  <span>No photo</span>
                )}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
