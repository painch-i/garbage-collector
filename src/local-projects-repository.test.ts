import { beforeEach, describe, expect, it } from "bun:test";
import { LocalProjectsRepository } from "./local-projects-repository";

describe("ProjectsLocalRepository", () => {
  let repository: LocalProjectsRepository;

  // Réinitialise le repository avant chaque test
  beforeEach(() => {
    repository = new LocalProjectsRepository();
  });

  it("should add a project", async () => {
    const projectData = {
      title: "Family Guy TV",
      details: "A Twitch channel streaming Family Guy 24/7",
      reason: "Frequent ban risk",
      votes: 0,
      projectUrl: "https://github.com/example/family-guy-tv",
    };

    const newProject = await repository.addProject(projectData);
    
    // Vérifie que le projet ajouté a un ID et que les données sont correctes
    expect(newProject.id).toBe(1);
    expect(newProject.title).toBe(projectData.title);
    expect(newProject.details).toBe(projectData.details);
    expect(newProject.reason).toBe(projectData.reason);
    expect(newProject.votes).toBe(0);
    expect(newProject.projectUrl).toBe(projectData.projectUrl);
  });

  it("should retrieve all projects", async () => {
    // Ajoute deux projets
    await repository.addProject({
      title: "Project 1",
      details: "Details for project 1",
      reason: "Just for testing",
      votes: 0,
      projectUrl: "https://github.com/example/project-1",
    });

    await repository.addProject({
      title: "Project 2",
      details: "Details for project 2",
      reason: "Another test",
      votes: 0,
      projectUrl: "https://github.com/example/project-2",
    });

    // Récupère tous les projets et vérifie qu'il y en a deux
    const projects = await repository.getProjects();
    expect(projects.length).toBe(2);
    expect(projects[0].title).toBe("Project 1");
    expect(projects[1].title).toBe("Project 2");
  });

  it("should upvote a project", async () => {
    // Ajoute un projet
    const projectData = {
      title: "Upvote Test Project",
      details: "Project to test upvote",
      reason: "Testing",
      votes: 0,
      projectUrl: "https://github.com/example/upvote-test",
    };
    const newProject = await repository.addProject(projectData);

    // Vérifie que les votes sont à 0 au départ
    expect(newProject.votes).toBe(0);

    // Incrémente les votes
    const updatedProject = await repository.upvoteProject(newProject.id);

    // Vérifie que le vote a bien été incrémenté
    expect(updatedProject).not.toBeNull();
    expect(updatedProject?.votes).toBe(1);
  });

  it("should return null when upvoting a non-existing project", async () => {
    // Tente d'incrémenter un projet qui n'existe pas
    const result = await repository.upvoteProject(999);
    expect(result).toBeNull();
  });
});
