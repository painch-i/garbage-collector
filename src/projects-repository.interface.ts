export interface Project {
  id: number;
  title: string;
  details: string;
  reason: string;
  votes: number;
  projectUrl: string;
  socialLinks: string[];
}

export interface ProjectsRepository {
  getProjects(): PromiseLike<Project[]>;
  addProject(project: Omit<Project, 'id'>): PromiseLike<Project>;
  upvoteProject(id: number): PromiseLike<Project | null>;
}