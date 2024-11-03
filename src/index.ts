import ejs from "ejs";
import fs from "fs";
import path from "path";
import { PrismaProjectsRepository } from "./prisma-projects-repository";
import type { Project, ProjectsRepository } from "./projects-repository.interface";

const PUBLIC_DIR = "public";
const LOGO_PUBLIC_PATH = "logo.png";
const DOMAIN_NAME = process.env.DOMAIN_NAME || "localhost";
const CERT_PATH = `/etc/letsencrypt/live/${DOMAIN_NAME}/fullchain.pem`
const KEY_PATH = `/etc/letsencrypt/live/${DOMAIN_NAME}/privkey.pem`
const PORT = process.env.PORT || 3000;
const tlsOptions = getTlsOptions();
let publicUrl = `${tlsOptions ? 'https' : 'http'}://${DOMAIN_NAME}:${PORT}`;
const logoFullPath = `/${PUBLIC_DIR}/${LOGO_PUBLIC_PATH}`;
const metaTitle = "The Abandoned Project Archive";
const metaDescription = "Explore and contribute to abandoned projects. Share your unfinished code, or discover and revitalize projects from the community.";

const viewsPath = path.join(process.cwd(), "views");
const publicPath = path.join(process.cwd(), PUBLIC_DIR);
const projectsRepository: ProjectsRepository = new PrismaProjectsRepository();

async function startServer() {
  const server = Bun.serve({
    port: process.env.PORT || 3000,
    tls: tlsOptions,
    fetch: handleRequest,
  });
  console.log(`Server running at ${publicUrl}`);
  }

async function handleRequest(request: Request): Promise<Response> {
  const url = new URL(request.url);
  const pathname = url.pathname;

  // Servir les fichiers statiques du dossier "public"
  if (pathname.startsWith(`/${PUBLIC_DIR}/`)) {
    return serveStaticFile(pathname);
  }

  // Gestion des routes
  if (pathname === "/") {
    return renderIndex();
  } else if (pathname === "/projects") {
    if (request.method === "GET") {
      return handleGetProjects();
    } else if (request.method === "POST") {
      return handlePostProject(request);
    }
  } else if (pathname.startsWith("/upvote/")) {
    const id = pathname.split("/")[2];
    return handleUpvoteProject(id);
  }

  return new Response("Not Found", { status: 404 });
}

async function serveStaticFile(pathname: string): Promise<Response> {
  try {
    const filePath = path.join(publicPath, pathname.replace(`/${PUBLIC_DIR}/`, ""));
    const file = fs.readFileSync(filePath);
    const ext = path.extname(filePath).toLowerCase();
    const contentType = getContentType(ext);

    return new Response(file, {
      headers: { "Content-Type": contentType },
    });
  } catch {
    return new Response("File Not Found", { status: 404 });
  }
}

function getContentType(ext: string): string {
  switch (ext) {
    case ".html":
      return "text/html";
    case ".css":
      return "text/css";
    case ".js":
      return "application/javascript";
    case ".png":
      return "image/png";
    case ".jpg":
    case ".jpeg":
      return "image/jpeg";
    case ".gif":
      return "image/gif";
    case ".svg":
      return "image/svg+xml";
    default:
      return "application/octet-stream";
  }
}

async function renderIndex(): Promise<Response> {
  const projects = await projectsRepository.getProjects();
  const html = await ejs.renderFile(path.join(viewsPath, "index.ejs"), {
    projects,
    publicUrl,
    logoPath: logoFullPath,
    metaTitle,
    metaDescription
  });
  return new Response(html, {
    headers: { "Content-Type": "text/html" },
  });
}

async function handleGetProjects(): Promise<Response> {
  const projects = await projectsRepository.getProjects();
  return new Response(JSON.stringify(projects), {
    headers: { "Content-Type": "application/json" },
  });
}

async function handlePostProject(request: Request): Promise<Response> {
  const { title, reason, details, projectUrl }: Project = await request.json();
  const newProject = {
    votes: 0,
    title,
    details,
    reason,
    projectUrl,
  };

  const addedProject = await projectsRepository.addProject(newProject);
  return new Response(JSON.stringify(addedProject), {
    headers: { "Content-Type": "application/json" },
    status: 201,
  });
}

async function handleUpvoteProject(id: string): Promise<Response> {
  const projectId = parseInt(id, 10);
  const project = await projectsRepository.upvoteProject(projectId);

  if (project) {
    return new Response(JSON.stringify(project), {
      headers: { "Content-Type": "application/json" },
    });
  }

  return new Response("Project not found", { status: 404 });
}

function getTlsOptions(): { key: string; cert: string } | undefined {
  try {
    const key = fs.readFileSync(KEY_PATH, "utf8");
    const cert = fs.readFileSync(CERT_PATH, "utf8");
    return { key, cert };
  } catch {
    console.log("No TLS certificate found, using HTTP");
    return;
  }
}

startServer();
