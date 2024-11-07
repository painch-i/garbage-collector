import { PrismaClient } from '@prisma/client';
import type { Project, ProjectsRepository } from './projects-repository.interface';


export class PrismaProjectsRepository implements ProjectsRepository {
prisma = new PrismaClient();
// Fonction pour récupérer tous les projets
  async getProjects(): Promise<Project[]> {
    return await this.prisma.project.findMany({
      orderBy: [{ votes: 'desc' }, { createdAt: 'desc' }],
    });
  }

  // Fonction pour ajouter un nouveau projet
  async addProject(project: Omit<Project, 'id'>): Promise<Project> {
    return await this.prisma.project.create({
      data: {
        title: project.title,
        details: project.details,
        reason: project.reason,
        projectUrl: project.projectUrl,
        votes: project.votes,
        socialLinks: project.socialLinks,
      },
    });
  }

  // Fonction pour voter pour un projet
  async upvoteProject(id: number): Promise<Project | null> {
    const project = await this.prisma.project.findUnique({
      where: { id },
    });

    if (!project) {
      return null;
    }

    return await this.prisma.project.update({
      where: { id },
      data: { votes: project.votes + 1 },
    });
  }
}
