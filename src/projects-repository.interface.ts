export interface Project {
  id: number;
  title: string;
  details: string;
  reason: string;
  votes: number;
  repositoryUrl: string; // Lien du dépôt
}

export interface ProjectsRepository {
  getProjects(): PromiseLike<Project[]>;
  addProject(project: Omit<Project, 'id'>): PromiseLike<Project>;
  upvoteProject(id: number): PromiseLike<Project | null>;
}