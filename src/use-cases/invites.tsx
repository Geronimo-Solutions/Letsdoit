import { getProjectById } from "@/data-access/projects";
import { createInvite, deleteInvite, getInvite } from "@/data-access/invites";
import { addMembership } from "@/data-access/membership";
import { ProjectId } from "@/db/schema";
import { InviteEmail } from "@/emails/invite";
import { sendEmail } from "@/lib/send-email";
import {
  assertAdminOrOwnerOfProject,
  assertProjectExists,
  isAdminOrOwnerOfProject,
} from "@/use-cases/authorization";
import { UserSession } from "@/use-cases/types";

export async function sendInviteUseCase(
  authenticatedUser: UserSession,
  { email, projectId }: { email: string; projectId: ProjectId }
) {
  await assertAdminOrOwnerOfProject(authenticatedUser, projectId);
  const project = await assertProjectExists(projectId);
  const invite = await createInvite(projectId);
  await sendEmail(
    email,
    "You have been invited to join a project",
    <InviteEmail project={project} token={invite.token} />
  );
}

export async function acceptInviteUseCase(
  authenticatedUser: UserSession,
  { token }: { token: string }
) {
  const invite = await getInvite(token);

  if (!invite) {
    throw new Error("This invite does not exist");
  }

  await addMembership(authenticatedUser.id, invite.projectId);
  await deleteInvite(token);

  return invite.projectId;
}
