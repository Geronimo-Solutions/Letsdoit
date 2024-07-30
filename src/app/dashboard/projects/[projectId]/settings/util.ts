import { Event, Project } from "@/db/schema";

export function getProjectImageUrl(project: Pick<Project, "id" | "bannerId">) {
  return `/api/projects/${project.id}/images/${project.bannerId ?? "default"}`;
}

export function getEventImageUrl(event: Event) {
  return `/api/projects/${event.projectId}/images/${event.imageId ?? "default"}`;
}
