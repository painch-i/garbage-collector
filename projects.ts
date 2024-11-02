// import Database from "@replit/database";

// const db = new Database();

// export async function getProjects(): Promise<Project[]> {
//   const result = await db.get("projects");

//   if (isOkResult(result)) {
//     return result.value || []; // Retourne les projets ou un tableau vide
//   }

//   return []; // Retourne un tableau vide en cas d'erreur
// }

// export async function addProject(project: Project): Promise<Project> {
//   const projects = await getProjects();
//   const newProject: Project = { ...project, id: projects.length + 1 }; // Assigne un nouvel ID
//   projects.push(newProject);
//   await db.set("projects", projects);
//   return newProject;
// }

// export async function upvoteProject(id: number): Promise<Project | null> {
//   const projects = await getProjects();
//   const project = projects.find((p) => p.id === id);

//   if (project) {
//     project.votes++;
//     await db.set("projects", projects);
//     return project;
//   }

//   return null;
// }

// // Fonction utilitaire pour vérifier si le résultat est un OkResult
// function isOkResult(result: any): result is OkResult {
//   return result && typeof result === "object" && "value" in result;
// }
