import { ProjectId } from "@/db/schema";
import { UserSession } from "./types";
import { getProjectById, getUsersInProject } from "@/data-access/projects";
import {
  assertAdminOrOwnerOfProject,
  assertEventExists,
  assertProjectExists,
  assertProjectVisible,
} from "./authorization";
import {
  createEvent,
  deleteEvent,
  getEvent,
  getEventsByProjectId,
  updateEvent,
} from "@/data-access/events";
import {
  MAX_UPLOAD_IMAGE_SIZE,
  MAX_UPLOAD_IMAGE_SIZE_IN_MB,
} from "@/app-config";
import { createUUID } from "@/util/uuid";
import { uploadFileToBucket } from "@/lib/files";
import { getProjectImageKey } from "./files";
import { createNotification } from "@/data-access/notifications";
import { NotFoundError } from "@/app/util";

export async function getEventsUseCase(
  authenticatedUser: UserSession | undefined,
  projectId: ProjectId
) {
  await assertProjectVisible(authenticatedUser, projectId);
  const events = await getEventsByProjectId(projectId);
  return events;
}

export async function getUpcomingEventsUseCase(
  authenticatedUser: UserSession | undefined,
  projectId: ProjectId
) {
  await assertProjectVisible(authenticatedUser, projectId);
  const events = await getEventsByProjectId(projectId);
  const upcomingEvents = events.filter((event) => {
    return new Date(event.startsOn) > new Date();
  });
  return upcomingEvents;
}

export async function createEventUseCase(
  authenticatedUser: UserSession,
  {
    projectId,
    name,
    description,
    startsOn,
    eventImage,
  }: {
    projectId: ProjectId;
    name: string;
    description: string;
    startsOn: Date;
    eventImage?: File;
  }
) {
  if (eventImage) {
    if (!eventImage.type.startsWith("image/")) {
      throw new Error("File should be an image.");
    }

    if (eventImage.size > MAX_UPLOAD_IMAGE_SIZE) {
      throw new Error(
        `File size too large. Max size is ${MAX_UPLOAD_IMAGE_SIZE_IN_MB}MB`
      );
    }
  }

  const project = await assertProjectExists(projectId);

  await assertAdminOrOwnerOfProject(authenticatedUser, projectId);

  const event = await createEvent({
    projectId,
    name,
    description,
    startsOn,
  });

  if (eventImage) {
    const imageId = createUUID();
    await uploadFileToBucket(eventImage, getProjectImageKey(projectId, imageId));
    await updateEvent(event.id, {
      imageId,
    });
  }

  // TODO: this could potentially be passed to a queue
  const usersInProject = await getUsersInProject(projectId);

  await Promise.all(
    usersInProject.map((user) =>
      createNotification({
        userId: user.userId,
        projectId: project.id,
        type: "event",
        message: `An event has been created for the "${project.name}" you joined.`,
        createdOn: new Date(),
      })
    )
  );
}

export async function editEventUseCase(
  authenticatedUser: UserSession,
  {
    eventId,
    name,
    description,
    startsOn,
    eventImage,
  }: {
    eventId: number;
    name: string;
    description: string;
    startsOn: Date;
    eventImage?: File;
  }
) {
  if (eventImage) {
    if (!eventImage.type.startsWith("image/")) {
      throw new Error("File should be an image.");
    }

    if (eventImage.size > MAX_UPLOAD_IMAGE_SIZE) {
      throw new Error(
        `File size too large. Max size is ${MAX_UPLOAD_IMAGE_SIZE_IN_MB}MB`
      );
    }
  }

  const event = await assertEventExists(eventId);
  await assertAdminOrOwnerOfProject(authenticatedUser, event.projectId);

  await updateEvent(event.id, {
    name,
    description,
    startsOn,
  });

  if (eventImage) {
    const imageId = createUUID();
    await uploadFileToBucket(
      eventImage,
      getProjectImageKey(event.projectId, imageId)
    );
    await updateEvent(event.id, {
      imageId,
    });
  }

  return event;
}
export async function deleteEventUseCase(
  authenticatedUser: UserSession,
  { eventId }: { eventId: number }
) {
  const event = await getEvent(eventId);

  if (!event) {
    throw new NotFoundError("Event not found");
  }

  await assertAdminOrOwnerOfProject(authenticatedUser, event.projectId);

  await deleteEvent(eventId);

  return event;
}
