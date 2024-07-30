"use server";

import { authenticatedAction } from "@/lib/safe-action";
import { updateProjectInfoUseCase } from "@/use-cases/projects";
import { createPostUseCase, deletePostUseCase } from "@/use-cases/posts";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { z } from "zod";

export const updateProjectInfoAction = authenticatedAction
  .createServerAction()
  .input(
    z.object({
      projectId: z.number(),
      info: z.string(),
    })
  )
  .handler(async ({ input, ctx }) => {
    await updateProjectInfoUseCase(ctx.user, {
      projectId: input.projectId,
      info: input.info,
    });

    revalidatePath(`/dashboard/projects/${input.projectId}/info`);
  });

export const createPostAction = authenticatedAction
  .createServerAction()
  .input(
    z.object({
      projectId: z.number().min(1),
      title: z.string().min(1),
      message: z.string().min(1),
    })
  )
  .handler(async ({ input: { projectId, title, message }, ctx: { user } }) => {
    await createPostUseCase(user, {
      projectId,
      title,
      message,
    });
    revalidatePath(`/dashboard/projects/${projectId}/posts`);
  });

export const deletePostAction = authenticatedAction
  .createServerAction()
  .input(
    z.object({
      postId: z.number(),
    })
  )
  .handler(async ({ input: { postId }, ctx: { user } }) => {
    const post = await deletePostUseCase(user, {
      postId,
    });
    redirect(`/dashboard/projects/${post.projectId}/posts`);
  });
