"use server";

import { authenticatedAction } from "@/lib/safe-action";
import { deleteProjectUseCase } from "@/use-cases/projects";
import { redirect } from "next/navigation";
import { z } from "zod";

export const deleteProjectAction = authenticatedAction
  .createServerAction()
  .input(
    z.object({
      projectId: z.number(),
    })
  )
  .handler(async ({ input, ctx }) => {
    const projectId = input.projectId;
    await deleteProjectUseCase(ctx.user, {
      projectId,
    });
    redirect("/dashboard");
  });
