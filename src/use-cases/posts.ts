import { ProjectId } from "@/db/schema"
import { UserSession } from "./types"
import { getProjectById } from "@/data-access/projects"
import { isProjectOwnerUseCase, isProjectVisibleToUserUseCase } from "./membership"
import {
  createPost,
  deletePost,
  getPostById,
  getRecentPublicPostsByUserId,
  getPostsInProject,
  updatePost,
} from "@/data-access/posts"
import { isAdminOrOwnerOfProject } from "./authorization"
import { AuthenticationError } from "@/app/util"

// TODO: clean up this function
export async function getPostsInProjectUseCase(
  authenticatedUser: UserSession | undefined,
  projectId: ProjectId
) {
  const project = await getProjectById(projectId)

  if (!project) {
    throw new Error("Project not found")
  }

  if (!isProjectVisibleToUserUseCase(authenticatedUser, projectId)) {
    throw new AuthenticationError()
  }

  const posts = await getPostsInProject(projectId)
  return posts
}

export async function getPostByIdUseCase(
  authenticatedUser: UserSession | undefined,
  postId: number
) {
  const post = await getPostById(postId)

  if (!post) {
    throw new Error("Post not found")
  }

  if (!isProjectVisibleToUserUseCase(authenticatedUser, post.projectId)) {
    throw new AuthenticationError()
  }

  return post
}

export async function createPostUseCase(
  authenticatedUser: UserSession,
  {
    projectId,
    title,
    message,
  }: {
    projectId: ProjectId
    title: string
    message: string
  }
) {
  const project = await getProjectById(projectId)

  if (!project) {
    throw new Error("Project not found")
  }

  if (!isProjectVisibleToUserUseCase(authenticatedUser, projectId)) {
    throw new AuthenticationError()
  }

  await createPost({
    userId: authenticatedUser.id,
    projectId,
    title,
    message,
    createdOn: new Date(),
  })
}

export async function deletePostUseCase(
  authenticatedUser: UserSession,
  {
    postId,
  }: {
    postId: number
  }
) {
  const post = await getPostById(postId)

  if (!post) {
    throw new Error("Post not found")
  }

  const project = await getProjectById(post.projectId)

  if (!project) {
    throw new Error("Project not found")
  }

  const isPostOwner = post.userId === authenticatedUser.id

  if (!isProjectOwnerUseCase(authenticatedUser, project.id) && !isPostOwner) {
    throw new AuthenticationError()
  }

  await deletePost(postId)

  return post
}

export async function updatePostUseCase(
  authenticatedUser: UserSession,
  {
    postId,
    message,
    title,
  }: {
    postId: number
    message: string
    title: string
  }
) {
  const post = await getPostById(postId)

  if (!post) {
    throw new Error("Post not found")
  }

  const project = await getProjectById(post.projectId)

  if (!project) {
    throw new Error("Project not found")
  }

  const isPostOwner = post.userId === authenticatedUser.id

  if (!isProjectOwnerUseCase(authenticatedUser, project.id) && !isPostOwner) {
    throw new AuthenticationError()
  }

  const updatedPost = await updatePost(postId, {
    message,
    title,
  })

  return updatedPost
}

export async function canEditPostUseCase(
  authenticatedUser: UserSession | undefined,
  postId: number
) {
  if (!authenticatedUser) return false

  const post = await getPostById(postId)

  if (!post) {
    return false
  }

  return (
    // (await isAdminOrOwnerOfProject(authenticatedUser, post.projectId)) ||
    post.userId === authenticatedUser.id
  )
}

export async function getPublicPostsByUserUseCase(userId: number) {
  const posts = await getRecentPublicPostsByUserId(userId)
  return posts
}
