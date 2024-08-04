import { MAX_UPLOAD_IMAGE_SIZE } from "@/app-config"
import { getProjectById, updateProject } from "@/data-access/projects"
import { ProjectBannerId, ProjectId } from "@/db/schema"
import {
  deleteFileFromBucket,
  getFileUrl,
  getPresignedPostUrl,
  uploadFileToBucket,
} from "@/lib/files"
import {
  assertAdminOrOwnerOfProject,
  assertProjectVisible,
  hasAccessToProject,
  isAdminOrOwnerOfProject,
} from "@/use-cases/authorization"
import { UserSession } from "@/use-cases/types"
import { createUUID } from "@/util/uuid"

export async function getProjectImageUploadUrlUseCase(
  authenticatedUser: UserSession,
  { projectId, contentType }: { projectId: ProjectId; contentType: string }
) {
  await assertAdminOrOwnerOfProject(authenticatedUser, projectId)
  const fileName = `${projectId}-image`
  return getPresignedPostUrl(fileName, contentType)
}

export async function updateProjectImageUseCase(
  authenticatedUser: UserSession,
  {
    projectId,
    currBannerId,
    file,
  }: { projectId: ProjectId; currBannerId: ProjectBannerId; file: File }
) {
  if (!file.type.startsWith("image/")) {
    throw new Error("File should be an image.")
  }

  if (file.size > MAX_UPLOAD_IMAGE_SIZE) {
    throw new Error("File size should be less than 5MB.")
  }

  await assertAdminOrOwnerOfProject(authenticatedUser, projectId)

  const imageId = createUUID()

  if (currBannerId) {
    await deleteFileFromBucket(getProjectImageKey(projectId, currBannerId))
  }

  await updateProject(projectId, { bannerId: imageId })
  await uploadFileToBucket(file, getProjectImageKey(projectId, imageId))
}

export function getProjectImageKey(projectId: ProjectId, imageId: string) {
  return `projects/${projectId}/images/${imageId}`
}

export async function getProjectImageUrlUseCase(
  authenticatedUser: UserSession | undefined,
  { projectId, imageId }: { projectId: ProjectId; imageId: string }
) {
  await assertProjectVisible(authenticatedUser, projectId)

  const url = await getFileUrl({
    key: getProjectImageKey(projectId, imageId),
  })

  return url
}
