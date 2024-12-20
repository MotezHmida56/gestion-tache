// Composant Chat avec le bouton de suppression conditionnel
import { useState, useEffect, useRef } from "react";
import DashboardLayout from "@/components/DashboardLayout";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Send, Paperclip, Smile, Trash } from "lucide-react";  // Ajout du Trash pour le bouton de suppression
import { Avatar } from "@/components/ui/avatar";
import { ScrollArea } from "@/components/ui/scroll-area";

interface Message {
  id: number;
  sender: string;
  contenu: string;
  timestamp: string;
  avatar?: string;
  isMe?: boolean;
  file?: string;
  auteur: string;  // Ajouter cette propriété pour le sender
}

const Chat = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState("");
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Récupérer l'ID de l'utilisateur connecté depuis le localStorage (ou autre méthode)
  const userId = localStorage.getItem("userId"); // Adapté selon votre méthode d'authentification

  // Fonction pour récupérer le nom d'utilisateur en fonction de userId
  const fetchUsername = async (userId: string) => {
    try {
      const response = await fetch(`http://localhost:8080/User/username/${userId}`);
      if (response.ok) {
        const data = await response.json();
        return data.username;
      } else {
        console.error("Utilisateur non trouvé");
        return "Utilisateur inconnu";
      }
    } catch (error) {
      console.error("Erreur lors de la récupération du nom d'utilisateur:", error);
      return "Utilisateur inconnu";
    }
  };

  // Effet pour charger les messages depuis le backend
  useEffect(() => {
    const fetchMessages = async () => {
      try {
        const response = await fetch("http://localhost:8080/chat/getMessages");
        if (response.ok) {
          const data: Message[] = await response.json();

          // Pour chaque message, récupérer le nom d'utilisateur
          const updatedMessages = await Promise.all(
            data.map(async (message) => {
              const username = await fetchUsername(message.auteur.toString());
              return { ...message, sender: username };
            })
          );

          setMessages(updatedMessages);
        } else {
          console.error("Échec de la récupération des messages");
        }
      } catch (error) {
        console.error("Erreur lors de la récupération des messages:", error);
      }
    };

    fetchMessages();
  }, []); // Exécution de cette fonction uniquement au montage du composant

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim() && !selectedFile) return;

    if (!userId) {
      console.error("Utilisateur non authentifié");
      return;
    }

    const messageData = {
      contenu: newMessage,
      auteur: userId, // Utiliser l'ID de l'utilisateur connecté
      dateEnvoi: Date.now(),
      file: selectedFile ? selectedFile.name : "",
    };

    try {
      const response = await fetch("http://localhost:8080/chat/sendMessage", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(messageData),
      });

      if (response.ok) {
        const newMessage = await response.json();
        const username = await fetchUsername(newMessage.auteur.toString()); // Récupérer le nom d'utilisateur
        setMessages((prevMessages) => [
          ...prevMessages,
          { ...newMessage, sender: username, isMe: true },
        ]);
        setNewMessage("");
        setSelectedFile(null);
      } else {
        console.error("Erreur lors de l'envoi du message");
      }
    } catch (error) {
      console.error("Erreur:", error);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setSelectedFile(e.target.files[0]);
    }
  };

  const insertEmoji = (emoji: string) => {
    setNewMessage(newMessage + emoji);
  };

  const handleDeleteMessage = async (messageId: number, messageAuthorId: string) => {
    // Vérifier si l'utilisateur connecté est l'auteur du message
    if (userId !== messageAuthorId) {
      console.error("Vous ne pouvez supprimer que vos propres messages");
      return; // L'utilisateur ne peut pas supprimer les messages d'autres personnes
    }

    try {
      const response = await fetch(`http://localhost:8080/chat/deleteMessage/${messageId}`, {
        method: "DELETE",
      });

      if (response.ok) {
        setMessages((prevMessages) => prevMessages.filter((message) => message.id !== messageId));
      } else {
        console.error("Échec de la suppression du message");
      }
    } catch (error) {
      console.error("Erreur lors de la suppression du message:", error);
    }
  };

  return (
    <DashboardLayout>
      <div className="h-[calc(100vh-2rem)] flex flex-col">
        {/* Chat Header */}
        <div className="border-b p-4 flex items-center justify-between">
          <h1 className="text-2xl font-semibold text-gray-900">Team Chat</h1>
        </div>

        {/* Chat Messages */}
        <ScrollArea className="flex-1 p-4">
          <div className="space-y-4">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex gap-3 ${message.isMe ? "flex-row-reverse" : "flex-row"} relative`}
              >
                {/* Bouton de suppression du message, visible seulement si l'utilisateur a envoyé le message */}
                {message.auteur === userId && (
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => handleDeleteMessage(message.id, message.auteur)}
                    className="absolute right-1 top-1 text-red-600"
                  >
                    <Trash className="h-5 w-5" />
                  </Button>
                )}

                {/* Affichage de l'avatar */}
                {!message.isMe && message.avatar && (
                  <Avatar>
                    <img
                      src={message.avatar}
                      alt={message.sender}
                      className="w-10 h-10 rounded-full"
                    />
                  </Avatar>
                )}

                {/* Contenu du message */}
                <div
                  className={`max-w-[70%] rounded-lg p-3 ${
                    message.isMe ? "bg-primary text-white" : "bg-secondary text-gray-800"
                  }`}
                >
                  <p className="text-xs font-medium text-gray-500 mb-1">{`Message envoyé par ${message.sender}`}</p>
                  {message.file ? (
                    <img
                      src={message.file} // Si c'est une image, l'afficher
                      alt="Attachment"
                      className="rounded-lg max-w-full"
                    />
                  ) : (
                    <p className="text-sm">{message.contenu}</p>
                  )}

                  {/* Affichage de l'horodatage */}
                  <p className="text-xs mt-1 opacity-70">{message.timestamp}</p>
                </div>
              </div>
            ))}
          </div>
        </ScrollArea>

        {/* Chat Input */}
        <form onSubmit={handleSendMessage} className="border-t p-4">
          <div className="flex items-center gap-4">
            <Button
              type="button"
              variant="ghost"
              size="icon"
              onClick={() => fileInputRef.current?.click()}
              className="text-gray-500"
            >
              <Paperclip className="h-5 w-5" />
            </Button>
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileChange}
              className="hidden"
            />

            <Button
              type="button"
              variant="ghost"
              size="icon"
              className="text-gray-500"
              onClick={() => insertEmoji("😊")}
            >
              😊
            </Button>

            <Input
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              placeholder="Type your message..."
              className="flex-1"
            />

            <Button type="submit" size="icon">
              <Send className="h-5 w-5" />
            </Button>
          </div>
        </form>
      </div>
    </DashboardLayout>
  );
};

export default Chat;
