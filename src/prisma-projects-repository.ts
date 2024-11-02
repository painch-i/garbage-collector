import { PrismaClient } from '@prisma/client';
import type { Project, ProjectsRepository } from './projects-repository.interface';

const prisma = new PrismaClient();

export class PrismaProjectsRepository implements ProjectsRepository {
  // Fonction pour récupérer tous les projets
  async getProjects(): Promise<Project[]> {
    return await prisma.project.findMany();
  }

  // Fonction pour ajouter un nouveau projet
  async addProject(project: Omit<Project, 'id'>): Promise<Project> {
    const newProject = await prisma.project.create({
      data: {
        ...project,
      },
    });
    return newProject;
  }

  // Fonction pour voter pour un projet
  async upvoteProject(id: number): Promise<Project | null> {
    const project = await prisma.project.findUnique({
      where: { id },
    });

    if (!project) {
      return null;
    }

    return await prisma.project.update({
      where: { id },
      data: { votes: project.votes + 1 },
    });
  }
}
