import type { Project, ProjectsRepository } from "./projects-repository.interface";

export class LocalProjectsRepository implements ProjectsRepository {
  // Stocke les projets en mémoire
  private projects: Project[] = [];

  // Fonction pour récupérer tous les projets
  async getProjects(): Promise<Project[]> {
    return this.projects;
  }

  // Fonction pour ajouter un nouveau projet
  async addProject(project: Omit<Project, 'id'>): Promise<Project> {
    const newProject: Project = {
      id: this.projects.length + 1, // Assigne un nouvel ID
      ...project,
    };

    this.projects.push(newProject);
    return newProject;
  }

  // Fonction pour voter pour un projet
  async upvoteProject(id: number): Promise<Project | null> {
    const project = this.projects.find((p) => p.id === id);

    if (project) {
      project.votes++;
      return project;
    }

    return null;
  }
}
