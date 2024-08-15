"use server"

import { authenticatedAction } from "@/lib/safe-action"
import { updatePostUseCase } from "@/use-cases/posts"
import {
  createReplyUseCase,
  deleteReplyUseCase,
  updateReplyUseCase,
} from "@/use-cases/replies"
import { revalidatePath } from "next/cache"
import { z } from "zod"

export const updatePostAction = authenticatedAction
  .createServerAction()
  .input(
    z.object({
      postId: z.number(),
      message: z.string(),
      title: z.string(),
    })
  )
  .handler(async ({ input, ctx }) => {
    const post = await updatePostUseCase(ctx.user, {
      postId: input.postId,
      message: input.message,
      title: input.title,
    })

    revalidatePath(`/dashboard/projects/${post.projectId}/posts/${post.id}`)
  })

export const updateReplyAction = authenticatedAction
  .createServerAction()
  .input(
    z.object({
      replyId: z.number(),
      message: z.string(),
    })
  )
  .handler(async ({ input, ctx }) => {
    const updatedReply = await updateReplyUseCase(ctx.user, {
      replyId: input.replyId,
      message: input.message,
    })

    revalidatePath(
      `/dashboard/projects/${updatedReply.projectId}/posts/${updatedReply.postId}`
    )
  })

export const createReplyAction = authenticatedAction
  .createServerAction()
  .input(
    z.object({
      projectId: z.number(),
      postId: z.number(),
      message: z.string(),
    })
  )
  .handler(async ({ input, ctx }) => {
    const reply = await createReplyUseCase(ctx.user, {
      postId: input.postId,
      message: input.message,
    })

    revalidatePath(`/dashboard/projects/${input.projectId}/posts/${reply.postId}`)
  })

export const deleteReplyAction = authenticatedAction
  .createServerAction()
  .input(
    z.object({
      replyId: z.number(),
      postId: z.number(),
      projectId: z.number(),
    })
  )
  .handler(async ({ input, ctx }) => {
    await deleteReplyUseCase(ctx.user, {
      replyId: input.replyId,
    })

    revalidatePath(`/dashboard/projects/${input.projectId}/posts/${input.postId}`)
  })
