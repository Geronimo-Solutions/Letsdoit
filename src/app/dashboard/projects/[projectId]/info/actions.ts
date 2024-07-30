"use server";

import { authenticatedAction } from "@/lib/safe-action";
import { updateProjectInfoUseCase } from "@/use-cases/projects";
import { revalidatePath } from "next/cache";
import { z } from "zod";
import sanitizeHtml from "sanitize-html";

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
      info: sanitizeHtml(input.info),
    });

    revalidatePath(`/dashboard/projects/${input.projectId}/info`);
  });
