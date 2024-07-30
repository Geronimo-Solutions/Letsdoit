"use server";

import { rateLimitByKey } from "@/lib/limiter";
import { authenticatedAction } from "@/lib/safe-action";
import { createProjectUseCase } from "@/use-cases/projects";
import { toZSAError } from "@/util/zsa-mapper";
import { schema } from "./validation";
import { revalidatePath } from "next/cache";

export const createProjectAction = authenticatedAction
  .createServerAction()
  .input(schema)
  .handler(async ({ input: { name, description }, ctx: { user } }) => {
    await rateLimitByKey({
      key: `${user.id}-create-project`,
    }).catch(toZSAError);
    await createProjectUseCase(user, {
      name,
      description,
    });
    revalidatePath("/dashboard");
  });
