"use server";

import { z } from "zod";
import { authenticatedAction } from "@/lib/safe-action";
import {
  createEventUseCase,
  deleteEventUseCase,
  editEventUseCase,
} from "@/use-cases/events";
import { revalidatePath } from "next/cache";

export const createEventAction = authenticatedAction
  .createServerAction()
  .input(
    z.object({
      projectId: z.number().min(1),
      name: z.string().min(1),
      description: z.string().min(1),
      startsOn: z.date(),
      fileWrapper: z.instanceof(FormData),
    })
  )
  .handler(
    async ({
      input: { projectId, name, description, startsOn, fileWrapper },
      ctx: { user },
    }) => {
      const eventImage = fileWrapper.get("file") as File;
      await createEventUseCase(user, {
        projectId,
        name,
        description,
        startsOn,
        eventImage,
      });
      revalidatePath(`/dashboard/projects/${projectId}/events`);
    }
  );

export const editEventAction = authenticatedAction
  .createServerAction()
  .input(
    z.object({
      eventId: z.number(),
      name: z.string().min(1),
      description: z.string().min(1),
      startsOn: z.date(),
      fileWrapper: z.instanceof(FormData),
    })
  )
  .handler(
    async ({
      input: { eventId, name, description, startsOn, fileWrapper },
      ctx: { user },
    }) => {
      const eventImage = fileWrapper.get("file") as File;
      const event = await editEventUseCase(user, {
        eventId,
        name,
        description,
        startsOn,
        eventImage,
      });
      revalidatePath(`/dashboard/projects/${event.projectId}/events`);
    }
  );

export const deleteEventAction = authenticatedAction
  .createServerAction()
  .input(
    z.object({
      eventId: z.number(),
    })
  )
  .handler(async ({ input: { eventId }, ctx: { user } }) => {
    const event = await deleteEventUseCase(user, {
      eventId,
    });
    revalidatePath(`/dashboard/projects/${event.projectId}/events`);
  });
