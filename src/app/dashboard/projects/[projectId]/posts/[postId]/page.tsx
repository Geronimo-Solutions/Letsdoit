import { getCurrentUser } from "@/lib/session"
import { cardStyles, linkStyles, pageTitleStyles } from "@/styles/common"
import { canEditPostUseCase, getPostByIdUseCase } from "@/use-cases/posts"
import { DeletePostButton } from "../delete-post-button"
import { EditPostForm } from "./edit-post-form"
import {
  getRepliesForPostUseCase,
  hasAccessToMutateReplyUseCase,
} from "@/use-cases/replies"
import { Suspense } from "react"
import { PostReplyForm } from "./post-reply-form"
import { ProjectId, Reply } from "@/db/schema"
import { getUserProfileUseCase } from "@/use-cases/users"
import { getProfileImageFullUrl } from "@/app/dashboard/settings/profile/profile-image"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Skeleton } from "@/components/ui/skeleton"
import { formatDate } from "@/util/date"
import { DeleteReplyButton } from "./delete-reply-button"
import { EditReplyButton } from "./edit-reply-button"
import {
  isProjectOwnerUseCase,
  isUserMemberOfProjectUseCase,
} from "@/use-cases/membership"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { ChevronLeft } from "lucide-react"
import { cn } from "@/lib/utils"

export default async function PostPage({
  params,
}: {
  params: { postId: string; projectId: string }
}) {
  const { postId, projectId } = params

  const user = await getCurrentUser()
  const post = await getPostByIdUseCase(user, parseInt(postId))
  const isPostAdmin = await canEditPostUseCase(user, parseInt(postId))
  const isProjectAdmin = await isProjectOwnerUseCase(user, Number(projectId))

  return (
    <div className="flex flex-col gap-8">
      <div className="flex justify-between items-center">
        <Button asChild>
          <Link href={`/dashboard/projects/${projectId}/posts`}>
            <ChevronLeft /> Back to Posts
          </Link>
        </Button>

        {(isPostAdmin || isProjectAdmin) && <DeletePostButton postId={post.id} />}
      </div>

      {!isPostAdmin && <h2 className={pageTitleStyles}>{post.title}</h2>}

      {isPostAdmin ? (
        <EditPostForm post={post} />
      ) : (
        <p className="whitespace-pre-line">{post.message}</p>
      )}

      {user && (
        <h2 className="text-2xl" id="replies">
          Replies
        </h2>
      )}

      <Suspense>
        <RepliesList projectId={parseInt(projectId)} postId={post.id} />
      </Suspense>
    </div>
  )
}

async function ReplyAvatar({ userId }: { userId: number }) {
  const profile = await getUserProfileUseCase(userId)

  return (
    <Link
      scroll={false}
      className={cn(linkStyles, "flex items-center gap-2")}
      href={`/users/${profile.userId}/info`}
    >
      <Avatar className="w-8 h-8">
        <AvatarImage src={getProfileImageFullUrl(profile)} />
        <AvatarFallback>
          {profile.displayName?.substring(0, 2).toUpperCase() ?? "AA"}
        </AvatarFallback>
      </Avatar>

      <p>{profile.displayName}</p>
    </Link>
  )
}

function ReplyAvatarFallback() {
  return (
    <div className="flex items-center gap-2">
      <Skeleton className="rounded-full w-8 h-8" />
      <Skeleton className="w-20 h-6" />
    </div>
  )
}

async function RepliesList({
  postId,
  projectId,
}: {
  postId: number
  projectId: ProjectId
}) {
  const user = await getCurrentUser()

  const replies = await getRepliesForPostUseCase(user, postId)
  const isMember = await isUserMemberOfProjectUseCase(user, projectId)

  return (
    <div className="flex flex-col gap-4">
      {replies.map((reply) => (
        <ReplyCard key={reply.id} reply={reply} />
      ))}

      {isMember && <PostReplyForm projectId={projectId} postId={postId} />}
    </div>
  )
}

async function ReplyCard({ reply }: { reply: Reply }) {
  const user = await getCurrentUser()
  const hasMutateAccess = await hasAccessToMutateReplyUseCase(user, reply.id)

  return (
    <div key={reply.id} className={cn(cardStyles, "p-4 space-y-3")}>
      <div className="flex justify-between">
        <div className="flex gap-4 items-center">
          <Suspense fallback={<ReplyAvatarFallback />}>
            <ReplyAvatar userId={reply.userId} />
          </Suspense>
          <div className="text-sm">{formatDate(reply.createdOn)}</div>
        </div>

        {hasMutateAccess && (
          <div className="flex gap-2">
            <EditReplyButton reply={reply} />
            <DeleteReplyButton reply={reply} />
          </div>
        )}
      </div>

      <p>{reply.message}</p>
    </div>
  )
}
