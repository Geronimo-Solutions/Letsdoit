import { database } from "@/db";
import { Project, ProjectId, NewProject, projects, memberships } from "@/db/schema";
import { UserId } from "@/use-cases/types";
import { omit } from "@/util/util";
import { and, count, eq, ilike, sql } from "drizzle-orm";

function appendProjectMemberCount<T extends { memberships: any[] }>(project: T) {
  return omit(
    {
      ...project,
      memberCount: project.memberships.length + 1,
    },
    "memberships"
  );
}

export async function createProject(project: NewProject) {
  await database.insert(projects).values(project);
}

export async function searchPublicProjectsByName(search: string, page: number) {
  const PROJECTS_PER_PAGE = 9;

  const condition = search
    ? and(eq(projects.isPublic, true), ilike(projects.name, `%${search}%`))
    : eq(projects.isPublic, true);

  const userMemberships = await database.query.projects.findMany({
    where: condition,
    with: {
      memberships: true,
    },
    limit: PROJECTS_PER_PAGE,
    offset: (page - 1) * PROJECTS_PER_PAGE,
  });

  const [countResult] = await database
    .select({
      count: sql`count(*)`.mapWith(Number).as("count"),
    })
    .from(projects)
    .where(condition);

  return {
    data: userMemberships.map(appendProjectMemberCount),
    total: countResult.count,
    perPage: PROJECTS_PER_PAGE,
  };
}

export async function getPublicProjectsByUser(userId: UserId) {
  const userProjects = await database.query.projects.findMany({
    where: and(eq(projects.userId, userId), eq(projects.isPublic, true)),
    with: {
      memberships: true,
    },
  });

  return userProjects.map(appendProjectMemberCount);
}

export async function countUserProjects(userId: UserId) {
  const [{ count: total }] = await database
    .select({ count: count() })
    .from(projects)
    .where(eq(projects.userId, userId));
  return total;
}

export async function getProjectsByUser(userId: UserId) {
  const userProjects = await database.query.projects.findMany({
    where: eq(projects.userId, userId),
    with: {
      memberships: true,
    },
  });

  return userProjects.map(appendProjectMemberCount);
}

export async function getProjectsByMembership(userId: UserId) {
  const userMemberships = await database.query.memberships.findMany({
    where: eq(memberships.userId, userId),
    with: {
      project: {
        with: {
          memberships: true,
        },
      },
    },
  });

  return userMemberships.map((membership) => {
    const project = membership.project;
    return appendProjectMemberCount(project);
  });
}

export async function getPublicProjectsByMembership(userId: UserId) {
  const userMemberships = await database.query.memberships.findMany({
    where: eq(memberships.userId, userId),
    with: {
      project: {
        with: {
          memberships: true,
        },
      },
    },
  });

  return userMemberships
    .filter((userMembership) => userMembership.project.isPublic)
    .map((membership) => {
      const project = membership.project;
      return appendProjectMemberCount(project);
    });
}

export async function getProjectById(projectId: ProjectId) {
  return await database.query.projects.findFirst({
    where: eq(projects.id, projectId),
  });
}

export async function updateProject(
  projectId: ProjectId,
  updatedProject: Partial<Project>
) {
  await database.update(projects).set(updatedProject).where(eq(projects.id, projectId));
}

export async function deleteProject(projectId: ProjectId) {
  await database.delete(projects).where(eq(projects.id, projectId));
}

export async function getProjectMembers(projectId: ProjectId) {
  return await database.query.memberships.findMany({
    where: eq(memberships.projectId, projectId),
    with: {
      profile: {
        columns: { displayName: true, image: true },
      },
    },
  });
}

export async function getProjectMembersCount(projectId: ProjectId) {
  const [{ count: total }] = await database
    .select({ count: count() })
    .from(memberships)
    .where(eq(memberships.projectId, projectId));
  return total;
}

export async function getUsersInProject(projectId: ProjectId) {
  return await database.query.memberships.findMany({
    where: eq(memberships.projectId, projectId),
  });
}
