import { AuthenticationError, NotFoundError } from "@/app/util";
import { getEvent } from "@/data-access/events";
import { getProjectById } from "@/data-access/projects";
import { getMembership } from "@/data-access/membership";
import { Project, ProjectId } from "@/db/schema";
import { UserSession } from "@/use-cases/types";

function isProjectOwner(user: UserSession, project: Project) {
  return user.id === project.userId;
}

export async function hasAccessToProject(
  user: UserSession | undefined,
  projectId: ProjectId
) {
  const project = await getProjectById(projectId);

  if (!project) {
    throw new Error("Project not found");
  }

  if (project.isPublic) {
    return true;
  }

  if (!user) {
    return false;
  }

  const membership = await getMembership(user.id, projectId);

  const isProjectOwner = project.userId === user.id;
  return !!membership || isProjectOwner;
}

export async function isAdminOrOwnerOfProject(
  user: UserSession | undefined,
  projectId: ProjectId
) {
  if (!user) {
    return false;
  }

  const membership = await getMembership(user.id, projectId);
  const project = await getProjectById(projectId);

  if (!project) {
    throw new Error("Project not found");
  }

  const isAdmin = membership?.role === "admin";
  const isOwner = project.userId === user.id;

  return isAdmin || isOwner;
}

export async function assertAdminOrOwnerOfProject(
  user: UserSession | undefined,
  projectId: ProjectId
) {
  if (!user) {
    throw new NotFoundError("User not found");
  }

  if (!(await isAdminOrOwnerOfProject(user, projectId))) {
    throw new AuthenticationError();
  }
}

export async function assertProjectOwner(
  user: UserSession | undefined,
  projectId: ProjectId
) {
  const project = await getProjectById(projectId);

  if (!project) {
    throw new NotFoundError("Project not found");
  }

  if (!user) {
    throw new AuthenticationError();
  }

  if (!isProjectOwner(user, project)) {
    throw new AuthenticationError();
  }

  return project;
}

export async function assertProjectMember(
  user: UserSession | undefined,
  projectId: ProjectId
) {
  const project = await getProjectById(projectId);

  if (!project) {
    throw new NotFoundError("Project not found");
  }

  if (!user) {
    throw new AuthenticationError();
  }

  const membership = await getMembership(user.id, projectId);
  const isProjectOwner = project.userId === user.id;

  if (!membership && !isProjectOwner) {
    throw new AuthenticationError();
  }

  return project;
}

export async function assertProjectVisible(
  user: UserSession | undefined,
  projectId: ProjectId
) {
  if (!user) {
    throw new AuthenticationError();
  }

  const project = await assertProjectExists(projectId);

  if (project.isPublic) {
    return { project, user };
  }

  const membership = await getMembership(user.id, projectId);

  const isProjectOwner = project.userId === user.id;
  if (!membership && !isProjectOwner) {
    throw new AuthenticationError();
  }

  return { project, user };
}

export async function assertProjectExists(projectId: ProjectId) {
  const project = await getProjectById(projectId);

  if (!project) {
    throw new NotFoundError("Project not found");
  }

  return project;
}

export async function assertEventExists(eventId: number) {
  const event = await getEvent(eventId);

  if (!event) {
    throw new NotFoundError("Event not found");
  }

  return event;
}
