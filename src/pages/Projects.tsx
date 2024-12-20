import { useState, useEffect } from "react";
import axios from "axios";
import DashboardLayout from "@/components/DashboardLayout";
import { Card } from "@/components/ui/card";
import { Folder, MoreVertical } from "lucide-react";

// URL de base pour l'API
const API_URL = "http://localhost:8080/";
const api = axios.create({
  baseURL: API_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// ====================== PROJETS API ======================
const getProjects = () => api.get("/projet/all").then((res) => res.data);
const createProject = (project) =>
  api
    .post("/projet/create", {
      nom: project.nom,
      description: project.description,
      user: { id: project.userId },
    })
    .then((res) => res.data)
    .catch((err) => {
      console.error("Erreur lors de la création du projet:", err);
      throw err;
    });

const updateProject = (id, project) =>
  api
    .put(`/projet/update/${id}`, {
      nom: project.nom,
      description: project.description,
      user_id: project.userId,
    })
    .then((res) => res.data);

const deleteProject = (id) =>
  api.delete(`/projet/delete/${id}`).then((res) => res.data);

// ====================== TACHES API ======================
const createTask = (task) =>
  api
    .post("/Tache/create", task)
    .then((res) => res.data)
    .catch((err) => {
      console.error("Erreur lors de la création de la tâche:", err);
      throw err;
    });

const getTasks = () => api.get("/Tache/all").then((res) => res.data);
const getUsers = () => api.get("/User/all").then((res) => res.data);

const Projects = () => {
  const [projectsData, setProjectsData] = useState([]);
  const [isProjectFormOpen, setIsProjectFormOpen] = useState(false);
  const [newProject, setNewProject] = useState({ nom: "", description: "", userId: "" });
  const [usersData, setUsersData] = useState([]);
  const [isTaskFormOpen, setIsTaskFormOpen] = useState(false);
  const [newTask, setNewTask] = useState({ nom: "", description: "", user_id: "", projet_id: "" });
  const [tasksData, setTasksData] = useState([]);
  const [tasksByProject, setTasksByProject] = useState({});
  const [selectedProjectId, setSelectedProjectId] = useState(null);
  const [currentUser, setCurrentUser] = useState(null);

  useEffect(() => {
    setCurrentUser({ id: 1 }); // Remplacez ceci par l'authentification réelle
    getProjects()
      .then((projects) => setProjectsData(projects))
      .catch((error) => console.error("Erreur lors de la récupération des projets", error));

    getUsers()
      .then((users) => setUsersData(users))
      .catch((error) => console.error("Erreur lors de la récupération des utilisateurs", error));

    getTasks()
      .then((tasks) => {
        setTasksData(tasks);
        const tasksGroupedByProject = tasks.reduce((acc, task) => {
          if (!acc[task.projet_id]) acc[task.projet_id] = [];
          acc[task.projet_id].push(task);
          return acc;
        }, {});
        setTasksByProject(tasksGroupedByProject);
      })
      .catch((error) => console.error("Erreur lors de la récupération des tâches", error));
  }, []);

  useEffect(() => {
    if (currentUser) {
      // Remplir l'ID utilisateur dans le formulaire du projet
      setNewProject((prev) => ({ ...prev, userId: currentUser.id }));

      // Remplir l'ID utilisateur dans le formulaire de la tâche
      setNewTask((prev) => ({ ...prev, user_id: currentUser.id }));
    }
  }, [currentUser]);
  const handleDeleteTask = (taskId, projectId) => {
    deleteTask(taskId)
      .then(() => {
        setTasksByProject((prevTasks) => {
          const updatedTasks = { ...prevTasks };
          updatedTasks[projectId] = updatedTasks[projectId].filter((task) => task.id !== taskId);
          return updatedTasks;
        });
      })
      .catch((error) => console.error("Erreur lors de la suppression de la tâche", error));
  };
  const deleteTask = (taskId) =>
    api.delete(`/Tache/delete/${taskId}`).then((res) => res.data);
  

  const handleProjectFormSubmit = () => {
    if (!newProject.nom || !newProject.description || !newProject.userId) {
      alert("Veuillez remplir tous les champs du formulaire.");
      return;
    }

    createProject(newProject)
      .then((newProjectData) => {
        setProjectsData((prevProjects) => [...prevProjects, newProjectData]);
        setNewProject({ nom: "", description: "", userId: currentUser.id });
        setIsProjectFormOpen(false);
      })
      .catch((error) => console.error("Erreur lors de la création du projet", error));
  };

  const handleDeleteProject = (id) => {
    deleteProject(id)
      .then(() => {
        setProjectsData((prevProjects) => prevProjects.filter((project) => project.id !== id));
      })
      .catch((error) => console.error("Erreur lors de la suppression du projet", error));
  };

  const handleTaskFormSubmit = () => {
    if (!newTask.nom || !newTask.description || !newTask.user_id || !newTask.projet_id) {
      alert("Veuillez remplir tous les champs du formulaire.");
      return;
    }

    createTask(newTask)
      .then((newTaskData) => {
        setTasksData((prevTasks) => [...prevTasks, newTaskData]);
        setNewTask({ nom: "", description: "", user_id: currentUser.id, projet_id: newTask.projet_id });
        setIsTaskFormOpen(false);
        setTasksByProject((prevTasks) => {
          const updatedTasks = { ...prevTasks };
          if (!updatedTasks[newTask.projet_id]) updatedTasks[newTask.projet_id] = [];
          updatedTasks[newTask.projet_id].push(newTaskData);
          return updatedTasks;
        });
      })
      .catch((error) => console.error("Erreur lors de la création de la tâche", error));
  };

  const handleOpenTaskForm = (project_id) => {
    setSelectedProjectId(project_id);
    setIsTaskFormOpen(true);
    setNewTask((prevState) => ({ ...prevState, projet_id: project_id }));
  };

  return (
    <DashboardLayout>
      {/* Section contenant les projets et les tâches */}
      <div className="space-y-8">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-semibold text-gray-900">Projects</h1>
            <p className="text-sm text-muted-foreground mt-1">Manage your projects and tasks</p>
          </div>
          <div className="flex gap-4">
            <button
              onClick={() => setIsProjectFormOpen(true)}
              className="text-white bg-green-500 hover:bg-green-600 p-2 rounded"
            >
              Add Project
            </button>
          </div>
        </div>

        {/* Liste des projets */}
        <div className="space-y-6">
          {projectsData.map((project) => (
            <Card key={project.id} className="p-6">
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="bg-secondary p-2 rounded">
                      <Folder className="h-5 w-5 text-primary" />
                    </div>
                    <h3 className="font-semibold">{project.nom}</h3>
                  </div>
                  <div className="flex items-center gap-4">
                    {currentUser && currentUser.id === project.user?.id && (
                      <button
                        onClick={() => handleDeleteProject(project.id)}
                        className="text-red-500 hover:text-red-700"
                      >
                        Delete
                      </button>
                    )}
                    <button>
                      <MoreVertical className="h-5 w-5 text-muted-foreground" />
                    </button>
                  </div>
                </div>
                <p>{project.description}</p>
                <p className="text-sm text-muted">Assigned to: {project.user?.name || "Unknown"}</p>
                {currentUser && currentUser.id === project.user?.id && (
                  <button
                    onClick={() => handleOpenTaskForm(project.id)}
                    className="mt-2 text-white bg-blue-500 hover:bg-blue-600 p-2 rounded"
                  >
                    Add Task
                  </button>
                )}
                {tasksByProject[project.id]?.map((task) => (
  <div
    key={task.id}
    className="mt-2 border p-2 rounded flex justify-between items-center"
  >
    <div>
      <h4 className="font-semibold">{task.nom}</h4>
      <p>{task.description}</p>
    </div>

    {/* Afficher le bouton seulement si le projet a été créé par l'utilisateur connecté */}
    {project.user.id === currentUser.id && (
      <button
        onClick={() => handleDeleteTask(task.id, project.id)}
        className="text-red-500 hover:text-red-600"
      >
        Delete Task
      </button>
    )}
  </div>
))}

              </div>
              
            </Card>
          ))}
        </div>
      </div>

      {/* Formulaire d'ajout de projet */}
      {isProjectFormOpen && (
        <div className="fixed inset-0 bg-gray-500 bg-opacity-50 flex justify-center items-center">
          <div className="bg-white p-6 rounded shadow-md w-1/3">
            <h3 className="text-xl font-semibold mb-4">Add New Project</h3>
            <div>
              <label className="block text-sm font-semibold mb-2" htmlFor="nom">
                Project Name
              </label>
              <input
                type="text"
                id="nom"
                name="nom"
                value={newProject.nom}
                onChange={(e) => setNewProject({ ...newProject, nom: e.target.value })}
                className="w-full p-2 mb-4 border rounded"
                required
              />
              <label className="block text-sm font-semibold mb-2" htmlFor="description">
                Description
              </label>
              <textarea
                id="description"
                name="description"
                value={newProject.description}
                onChange={(e) => setNewProject({ ...newProject, description: e.target.value })}
                className="w-full p-2 mb-4 border rounded"
                required
              />
              <input type="hidden" value={newProject.userId} />

              <div className="flex justify-end">
                <button
                  type="button"
                  onClick={handleProjectFormSubmit}
                  className="text-white bg-green-500 hover:bg-green-600 px-4 py-2 rounded"
                >
                  Save Project
                </button>
                <button
                  type="button"
                  onClick={() => setIsProjectFormOpen(false)}
                  className="ml-2 text-gray-500 hover:text-gray-700 px-4 py-2 rounded"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Formulaire d'ajout de tâche */}
      {isTaskFormOpen && (
        <div className="fixed inset-0 bg-gray-500 bg-opacity-50 flex justify-center items-center">
          <div className="bg-white p-6 rounded shadow-md w-1/3">
            <h3 className="text-xl font-semibold mb-4">Add Task</h3>
            <div>
              <label className="block text-sm font-semibold mb-2" htmlFor="nom">
                Task Name
              </label>
              <input
                type="text"
                id="nom"
                name="nom"
                value={newTask.nom}
                onChange={(e) => setNewTask({ ...newTask, nom: e.target.value })}
                className="w-full p-2 mb-4 border rounded"
                required
              />
              <label className="block text-sm font-semibold mb-2" htmlFor="description">
                Task Description
              </label>
              <textarea
                id="description"
                name="description"
                value={newTask.description}
                onChange={(e) => setNewTask({ ...newTask, description: e.target.value })}
                className="w-full p-2 mb-4 border rounded"
                required
              />
              <div className="flex justify-end">
                <button
                  type="button"
                  onClick={handleTaskFormSubmit}
                  className="text-white bg-blue-500 hover:bg-blue-600 px-4 py-2 rounded"
                >
                  Save Task
                </button>
                <button
                  type="button"
                  onClick={() => setIsTaskFormOpen(false)}
                  className="ml-2 text-gray-500 hover:text-gray-700 px-4 py-2 rounded"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </DashboardLayout>
  );
};

export default Projects;
