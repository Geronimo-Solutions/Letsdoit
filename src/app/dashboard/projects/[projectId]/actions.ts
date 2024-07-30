"use server";

import { authenticatedAction } from "@/lib/safe-action";
import { getPublicProjectInfoByIdUseCase } from "@/use-cases/projects";
import { sendInviteUseCase } from "@/use-cases/invites";
import { joinProjectUseCase, leaveProjectUseCase } from "@/use-cases/membership";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { z } from "zod";

export const joinProjectAction = authenticatedAction
  .createServerAction()
  .input(z.number())
  .handler(async ({ input: projectId, ctx }) => {
    await joinProjectUseCase(ctx.user, projectId);
    revalidatePath(`/dashboard/projects/${projectId}`, "layout");
  });

export const leaveProjectAction = authenticatedAction
  .createServerAction()
  .input(z.number())
  .handler(async ({ input: projectId, ctx }) => {
    const project = await getPublicProjectInfoByIdUseCase(projectId);
    await leaveProjectUseCase(ctx.user, projectId);
    if (project?.isPublic) {
      revalidatePath(`/dashboard/projects/${projectId}`, "layout");
    } else {
      redirect("/dashboard");
    }
  });

export const sendInviteAction = authenticatedAction
  .createServerAction()
  .input(
    z.object({
      email: z.string().email(),
      projectId: z.number(),
    })
  )
  .handler(async ({ input: { email, projectId }, ctx }) => {
    await sendInviteUseCase(ctx.user, { email, projectId });
  });
