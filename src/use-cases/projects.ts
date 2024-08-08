import { MAX_PROJECT_LIMIT, MAX_PROJECT_PREMIUM_LIMIT } from "@/app-config"
import { AuthenticationError } from "@/app/util"
import {
  countUserProjects,
  createProject,
  deleteProject,
  getProjectById,
  getProjectMembers,
  getProjectMembersCount,
  getProjectsByMembership,
  getProjectsByUser,
  getPublicProjectsByMembership,
  getPublicProjectsByUser,
  searchPublicProjectsByName,
  updateProject,
} from "@/data-access/projects"
import { getProfile } from "@/data-access/profiles"
import { ProjectId } from "@/db/schema"
import {
  assertProjectMember,
  assertProjectOwner,
  assertProjectVisible,
  isAdminOrOwnerOfProject,
} from "@/use-cases/authorization"
import { MemberInfo, UserId, UserSession } from "@/use-cases/types"
import { omit } from "lodash"
import { getProfileImageFullUrl } from "@/app/dashboard/settings/profile/profile-image"
import { getProfileImageUrl } from "./users"
import { getSubscription } from "@/data-access/subscriptions"
import { isSubscriptionActive } from "@/util/subscriptions"
import { getSubscriptionPlan } from "./subscriptions"

export async function createProjectUseCase(
  authenticatedUser: UserSession,
  newProject: {
    name: string
    description: string
  }
) {
  const numberOfProjects = await countUserProjects(authenticatedUser.id)

  if (numberOfProjects >= MAX_PROJECT_LIMIT) {
    const subscription = await getSubscription(authenticatedUser.id)
    if (!isSubscriptionActive(subscription)) {
      // TODO once Stripe is inegrated this can be changed..
      throw new Error("You have reached the maximum number of projects")
      // You can upgrage to a higher plan and get more free projects.)
    }

    const plan = getSubscriptionPlan(subscription)

    if (
      numberOfProjects >=
      (plan === "premium" ? MAX_PROJECT_PREMIUM_LIMIT : MAX_PROJECT_LIMIT)
    ) {
      throw new Error("You have reached the maximum number of projects")
    }
  }

  await createProject({ ...newProject, userId: authenticatedUser.id })
}

export async function getPublicProjectsByUserIdUseCase(userId: UserId) {
  return [
    ...(await getPublicProjectsByUser(userId)),
    ...(await getPublicProjectsByMembership(userId)),
  ]
}

export async function getProjectsByUserUseCase(authenticatedUser: UserSession) {
  return [
    ...(await getProjectsByUser(authenticatedUser.id)),
    ...(await getProjectsByMembership(authenticatedUser.id)),
  ]
}

export async function getPublicProjectInfoByIdUseCase(projectId: ProjectId) {
  const project = await getProjectById(projectId)
  if (!project) return undefined
  return omit(project, "userId")
}

export async function getProjectByIdUseCase(
  authenticatedUser: UserSession,
  projectId: ProjectId
) {
  await assertProjectMember(authenticatedUser, projectId)
  return await getProjectById(projectId)
}

export async function searchPublicProjectsUseCase(search: string, page: number) {
  return await searchPublicProjectsByName(search, page)
}

export async function toggleProjectVisibilityUseCase(
  authenticatedUser: UserSession,
  projectId: ProjectId
) {
  const project = await assertProjectOwner(authenticatedUser, projectId)

  await updateProject(projectId, {
    isPublic: !project.isPublic,
  })
}

export async function getProjectMembersUseCase(
  authenticatedUser: UserSession | undefined,
  projectId: ProjectId
): Promise<MemberInfo[]> {
  const { project } = await assertProjectVisible(authenticatedUser, projectId)

  const owner = (await getProfile(project.userId))!
  const members = await getProjectMembers(projectId)

  return [
    {
      name: owner.displayName,
      userId: owner.userId,
      image: getProfileImageFullUrl(owner),
      role: "owner",
    },
    ...members.map((member) => ({
      name: member.profile.displayName,
      userId: member.userId,
      image: member.profile.imageId
        ? getProfileImageUrl(member.userId, member.profile.imageId)
        : member.profile.image,
      role: member.role ?? "member",
    })),
  ]
}

export async function getMemberCountUseCase(
  authenticatedUser: UserSession | undefined,
  projectId: ProjectId
) {
  await assertProjectVisible(authenticatedUser, projectId)

  // we add one because the owner of the project isn't part of the membership count
  const count = (await getProjectMembersCount(projectId)) + 1

  return count
}

export async function updateProjectInfoUseCase(
  authenticatedUser: UserSession,
  {
    projectId,
    info,
  }: {
    projectId: ProjectId
    info: string
  }
) {
  await assertProjectOwner(authenticatedUser, projectId)
  await updateProject(projectId, { info })
}

export async function updateProjectSocialLinksUseCase(
  authenticatedUser: UserSession,
  {
    projectId,
    githubLink,
    discordLink,
    xLink,
    youtubeLink,
  }: {
    projectId: ProjectId
    githubLink?: string
    discordLink?: string
    xLink?: string
    youtubeLink?: string
  }
) {
  await assertProjectOwner(authenticatedUser, projectId)
  await updateProject(projectId, {
    githubLink,
    discordLink,
    xLink,
    youtubeLink,
  })
}

export async function updateProjectNameUseCase(
  authenticatedUser: UserSession,
  {
    projectId,
    newName,
  }: {
    projectId: ProjectId
    newName: string
  }
) {
  await assertProjectOwner(authenticatedUser, projectId)
  await updateProject(projectId, { name: newName })
}

export async function updateProjectDescriptionUseCase(
  authenticatedUser: UserSession,
  {
    projectId,
    description,
  }: {
    projectId: ProjectId
    description: string
  }
) {
  await assertProjectOwner(authenticatedUser, projectId)
  await updateProject(projectId, { description })
}

export async function deleteProjectUseCase(
  authenticatedUser: UserSession,
  { projectId }: { projectId: ProjectId }
) {
  await assertProjectOwner(authenticatedUser, projectId)
  await deleteProject(projectId)
}

export async function isAdminOrOwnerOfProjectUseCase(
  authenticatedUser: UserSession | undefined,
  projectId: ProjectId
) {
  return isAdminOrOwnerOfProject(authenticatedUser, projectId)
}
