import { NotFoundError } from "@/app/util";
import { getProjectById, getProjectsByUser } from "@/data-access/projects";
import {
  addMembership,
  getMembership,
  getMembershipsByUserId,
  removeMembership,
  updateMembership,
} from "@/data-access/membership";
import { Role, UserId, UserSession } from "@/use-cases/types";
import { assertProjectOwner, assertProjectVisible } from "./authorization";

export async function isProjectOwnerUseCase(
  authenticatedUser: UserSession | undefined,
  projectId: number
) {
  if (!authenticatedUser) return false;

  const project = await getProjectById(projectId);

  if (!project) {
    throw new NotFoundError("Project not found");
  }

  const isProjectOwner = project.userId === authenticatedUser.id;
  return isProjectOwner;
}

export async function isUserMemberOfProjectUseCase(
  authenticatedUser: UserSession | undefined,
  projectId: number
) {
  if (!authenticatedUser) return false;

  const membership = await getMembership(authenticatedUser.id, projectId);
  const project = await getProjectById(projectId);

  if (!project) {
    throw new Error("Project not found");
  }

  const isProjectOwner = project.userId === authenticatedUser.id;
  return !!membership || isProjectOwner;
}

export async function isProjectVisibleToUserUseCase(
  authenticatedUser: UserSession | undefined,
  projectId: number
) {
  return assertProjectVisible(authenticatedUser, projectId)
    .then(() => true)
    .catch(() => false);
}

export async function joinProjectUseCase(
  authenticatedUser: UserSession,
  projectId: number
) {
  const membership = await getMembership(authenticatedUser.id, projectId);
  if (membership) {
    throw new Error("User is already a member of this project");
  }
  await addMembership(authenticatedUser.id, projectId);
}

export async function leaveProjectUseCase(
  authenticatedUser: UserSession,
  projectId: number
) {
  const membership = await getMembership(authenticatedUser.id, projectId);
  if (!membership) {
    throw new Error("User is not a member of this project");
  }
  await removeMembership(authenticatedUser.id, projectId);
}

export async function getUserMembershipsUseCase(userId: UserId) {
  return getMembershipsByUserId(userId);
}

export async function getMembershipListUseCase(userId: UserId) {
  const memberships = await getMembershipsByUserId(userId);
  const ownedProjects = await getProjectsByUser(userId);

  return [
    ...ownedProjects.map((project) => ({
      projectId: project.id,
      role: "admin" as Role,
    })),
    ...memberships.map((membership) => ({
      projectId: membership.projectId,
      role: membership.role as Role,
    })),
  ];
}

export async function kickMemberUseCase(
  authenticatedUser: UserSession,
  { userId, projectId }: { userId: UserId; projectId: number }
) {
  const membership = await getMembership(userId, projectId);
  if (!membership) {
    throw new Error("User is not a member of this project");
  }
  await assertProjectOwner(authenticatedUser, projectId);
  await removeMembership(userId, projectId);
}

export async function switchMemberRoleUseCase(
  authenticatedUser: UserSession,
  {
    userId,
    projectId,
    role,
  }: { userId: UserId; projectId: number; role: "admin" | "member" }
) {
  const membership = await getMembership(userId, projectId);
  if (!membership) {
    throw new Error("User is not a member of this project");
  }
  await assertProjectOwner(authenticatedUser, projectId);
  await updateMembership(membership.id, {
    role,
  });
}
