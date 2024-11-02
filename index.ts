import ejs from "ejs";
import path from "path";
import { PrismaProjectsRepository } from "./prisma-projects-repository";
import type { Project, ProjectsRepository } from "./projects-repository.interface";

const viewsPath = path.join(process.cwd(), "views");
const projectsRepository: ProjectsRepository = new PrismaProjectsRepository();


const server = Bun.serve({
  port: process.env.PORT || 3000,
  fetch(request: Request) {
    const url = new URL(request.url);

    // Gestion des routes
    if (url.pathname === "/") {
      return renderIndex();
    } else if (url.pathname === "/projects") {
      if (request.method === "GET") {
        return handleGetProjects();
      } else if (request.method === "POST") {
        return handlePostProject(request);
      }
    } else if (url.pathname.startsWith("/upvote/")) {
      const id = url.pathname.split("/")[2];
      return handleUpvoteProject(id);
    }

    return new Response("Not Found", { status: 404 });
  },
});

async function renderIndex(): Promise<Response> {
  const projects = await projectsRepository.getProjects();
  console.table(projects);
  const html = await ejs.renderFile(path.join(viewsPath, "index.ejs"), { projects });
  return new Response(html, {
    headers: { "Content-Type": "text/html" },
  });
}

async function handleGetProjects(): Promise<Response> {
  const projects = await projectsRepository.getProjects(); // Récupérer les projets de la DB
  return new Response(JSON.stringify(projects), {
    headers: { "Content-Type": "application/json" },
  });
}

async function handlePostProject(request: Request): Promise<Response> {
  const {
    title,
    reason,
    details,
    repositoryUrl,
  }: Project = await request.json();
  const newProject: Project = {
    id: 0, // L'ID sera déterminé lors de l'ajout
    votes: 0,
    title,
    details,
    reason,
    repositoryUrl, // Inclure le lien du dépôt
  };

  const addedProject = await projectsRepository.addProject(newProject); // Ajouter le projet
  return new Response(JSON.stringify(addedProject), {
    headers: { "Content-Type": "application/json" },
    status: 201,
  });
}

async function handleUpvoteProject(id: string): Promise<Response> {
  const projectId = parseInt(id, 10);
  const project = await projectsRepository.upvoteProject(projectId); // Mettre à jour le vote du projet

  if (project) {
    return new Response(JSON.stringify(project), {
      headers: { "Content-Type": "application/json" },
    });
  }

  return new Response("Project not found", { status: 404 });
}

console.log(`Listening on localhost:${server.port}`);
