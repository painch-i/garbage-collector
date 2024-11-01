export interface Project {
  id: number;
  title: string;
  headline: string;
  pitch: string;
  votes: number;
  repositoryUrl: string; // Lien du dépôt
}

// Stocke les projets en mémoire
let projects: Project[] = [];

// Fonction pour récupérer tous les projets
export function getProjects(): Project[] {
  return projects;
}

// Fonction pour ajouter un nouveau projet
export function addProject(project: Omit<Project, 'id'>): Project {
  const newProject: Project = {
    id: projects.length + 1, // Assigne un nouvel ID
    ...project,
  };

  projects.push(newProject);
  return newProject;
}

// Fonction pour voter pour un projet
export function upvoteProject(id: number): Project | null {
  const project = projects.find((p) => p.id === id);

  if (project) {
    project.votes++;
    return project;
  }

  return null;
}
