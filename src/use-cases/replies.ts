import { getPostById } from "@/data-access/posts";
import { UserSession } from "./types";
import { hasAccessToProject, isAdminOrOwnerOfProject } from "./authorization";
import {
  createReply,
  deleteReply,
  getRepliesOnPost,
  getReplyById,
  getReplyCountOnPost,
  updateReply,
} from "@/data-access/replies";
import { createNotification } from "@/data-access/notifications";

export async function getReplyCountUseCase(
  authenticatedUser: UserSession | undefined,
  postId: number
) {
  const replyCount = await getReplyCountOnPost(postId);
  return replyCount;
}

export async function getRepliesForPostUseCase(
  authenticatedUser: UserSession | undefined,
  postId: number
) {
  const post = await getPostById(postId);

  if (!post) {
    throw new Error("Post not found");
  }

  const hasAccess = await hasAccessToProject(authenticatedUser, post.projectId);

  if (!hasAccess) {
    throw new Error("User does not have access to this project");
  }

  const replies = await getRepliesOnPost(postId);

  return replies;
}

export async function createReplyUseCase(
  authenticatedUser: UserSession,
  reply: { postId: number; message: string }
) {
  const post = await getPostById(reply.postId);

  if (!post) {
    throw new Error("Post not found");
  }

  const hasAccess = await hasAccessToProject(authenticatedUser, post.projectId);

  if (!hasAccess) {
    throw new Error("User does not have access to this project");
  }

  const createdReply = await createReply({
    postId: reply.postId,
    message: reply.message,
    projectId: post.projectId,
    userId: authenticatedUser.id,
    createdOn: new Date(),
  });

  if (post.userId !== authenticatedUser.id) {
    await createNotification({
      userId: post.userId,
      projectId: post.projectId,
      postId: post.id,
      type: "reply",
      message: `Someone replied to your post titled ${post.title}.`,
      createdOn: new Date(),
    });
  }

  return createdReply;
}

export async function deleteReplyUseCase(
  authenticatedUser: UserSession,
  reply: { replyId: number }
) {
  const replyToDelete = await getReplyById(reply.replyId);

  if (!replyToDelete) {
    throw new Error("Reply not found");
  }

  const post = await getPostById(replyToDelete.postId);

  if (!post) {
    throw new Error("Post not found");
  }

  const hasAccess = await isAdminOrOwnerOfProject(
    authenticatedUser,
    post.projectId
  );

  if (!hasAccess && replyToDelete.userId !== authenticatedUser.id) {
    throw new Error("User does not have permission to delete this reply");
  }

  await deleteReply(reply.replyId);
}

export async function updateReplyUseCase(
  authenticatedUser: UserSession,
  reply: {
    replyId: number;
    message: string;
  }
) {
  const replyAccess = await hasAccessToMutateReply(
    authenticatedUser,
    reply.replyId
  );

  if (!replyAccess) {
    throw new Error("User does not have access to this reply");
  }

  const updatedReply = await updateReply(reply.replyId, {
    message: reply.message,
  });

  return updatedReply;
}

export async function hasAccessToMutateReply(
  authenticatedUser: UserSession | undefined,
  replyId: number
) {
  if (!authenticatedUser) return false;

  const replyToUpdate = await getReplyById(replyId);

  if (!replyToUpdate) {
    return null;
  }

  const post = await getPostById(replyToUpdate.postId);

  if (!post) {
    return null;
  }

  const hasAccess = await isAdminOrOwnerOfProject(
    authenticatedUser,
    post.projectId
  );

  if (!hasAccess && replyToUpdate.userId !== authenticatedUser.id) {
    return null;
  }

  return {
    reply: replyToUpdate,
    post,
  };
}

export async function hasAccessToMutateReplyUseCase(
  authenticatedUser: UserSession | undefined,
  replyId: number
) {
  const replyAccess = await hasAccessToMutateReply(authenticatedUser, replyId);
  return replyAccess;
}
