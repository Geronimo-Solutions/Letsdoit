"use server"

import { authenticatedAction } from "@/lib/safe-action"
import {
  getProjectImageUploadUrlUseCase,
  updateProjectImageUseCase,
} from "@/use-cases/files"
import {
  toggleProjectVisibilityUseCase,
  updateProjectDescriptionUseCase,
  updateProjectNameUseCase,
  updateProjectSocialLinksUseCase,
} from "@/use-cases/projects"
import { revalidatePath } from "next/cache"
import { z } from "zod"
import { socialUrlSchema } from "./schema"

export const updateProjectDescriptionAction = authenticatedAction
  .createServerAction()
  .input(
    z.object({
      projectId: z.number(),
      description: z.string().min(1).max(750),
    })
  )
  .handler(async ({ input, ctx }) => {
    const projectId = input.projectId
    await updateProjectDescriptionUseCase(ctx.user, {
      projectId,
      description: input.description,
    })
    revalidatePath(`/dashboard/projects/${projectId}/settings`)
  })

export const updateProjectSocialLinksAction = authenticatedAction
  .createServerAction()
  .input(
    z.object({
      projectId: z.number(),
      ...socialUrlSchema,
    })
  )
  .handler(async ({ input, ctx }) => {
    const projectId = input.projectId
    await updateProjectSocialLinksUseCase(ctx.user, input)
    revalidatePath(`/dashboard/projects/${projectId}/settings`)
  })

export const updateProjectNameAction = authenticatedAction
  .createServerAction()
  .input(
    z.object({
      projectId: z.number(),
      name: z.string(),
    })
  )
  .handler(async ({ input, ctx }) => {
    const projectId = input.projectId
    await updateProjectNameUseCase(ctx.user, {
      projectId,
      newName: input.name,
    })
    revalidatePath(`/dashboard/projects/${projectId}/settings`)
  })

export const toggleProjectVisibilityAction = authenticatedAction
  .createServerAction()
  .input(z.number())
  .handler(async ({ input: projectId, ctx: { user } }) => {
    await toggleProjectVisibilityUseCase(user, projectId)
    revalidatePath(`/dashboard/projects/${projectId}/settings`)
  })

export const getPresignedPostUrlAction = authenticatedAction
  .createServerAction()
  .input(
    z.object({
      projectId: z.number(),
      contentType: z.string(),
    })
  )
  .handler(async ({ input: { projectId, contentType }, ctx: { user } }) => {
    return await getProjectImageUploadUrlUseCase(user, { projectId, contentType })
  })

export const uploadImageAction = authenticatedAction
  .createServerAction()
  .input(
    z.object({
      projectId: z.number(),
      currBannerId: z.string().nullable(),
      fileWrapper: z.instanceof(FormData),
    })
  )
  .handler(async ({ input, ctx: { user } }) => {
    const file = input.fileWrapper.get("file") as File
    await updateProjectImageUseCase(user, {
      projectId: input.projectId,
      currBannerId: input.currBannerId,
      file,
    })
    revalidatePath(`/dashboard/projects/${input.projectId}/settings`)
  })
