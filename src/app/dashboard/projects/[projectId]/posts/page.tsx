import { getCurrentUser } from "@/lib/session";
import { cardStyles, pageTitleStyles } from "@/styles/common";
import { getPostsInProjectUseCase } from "@/use-cases/posts";
import Image from "next/image";
import { CreatePostButton } from "./create-post-button";
import { PostCard } from "./post-card";
import { Suspense } from "react";
import { Skeleton } from "@/components/ui/skeleton";
import {
  isProjectVisibleToUserUseCase,
  isUserMemberOfProjectUseCase,
} from "@/use-cases/membership";
import { cn } from "@/lib/utils";

export default async function PostsPage({
  params,
}: {
  params: { projectId: string };
}) {
  const { projectId } = params;

  const user = await getCurrentUser();
  const canPost = await isUserMemberOfProjectUseCase(user, parseInt(projectId));

  return (
    <div className="flex flex-col gap-8">
      <div className="flex justify-between items-center">
        <h2 className={pageTitleStyles}>Posts</h2>
        {canPost && <CreatePostButton />}
      </div>

      <Suspense fallback={<PostsListLoader />}>
        <PostsList projectId={projectId} />
      </Suspense>
    </div>
  );
}

function PostsListLoader() {
  return new Array(4).fill("").map(() => {
    return <Skeleton className="h-40 w-full" />;
  });
}

async function PostsList({ projectId }: { projectId: string }) {
  const user = await getCurrentUser();

  const posts = await getPostsInProjectUseCase(user, parseInt(projectId));

  return (
    <>
      {posts.length === 0 && (
        <div
          className={cn(
            cardStyles,
            "flex flex-col gap-8 justify-center items-center py-12"
          )}
        >
          <Image
            src="/empty-state/no-data.svg"
            width="200"
            height="200"
            alt="no image placeholder image"
          ></Image>
          <h2>No posts created yet</h2>
          <CreatePostButton />
        </div>
      )}

      {posts.map((post) => (
        <PostCard key={post.id} post={post} />
      ))}
    </>
  );
}
