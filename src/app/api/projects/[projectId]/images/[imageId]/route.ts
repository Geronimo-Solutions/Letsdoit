import { streamImageFromUrl } from "@/app/api/streams";
import { env } from "@/env";
import { getCurrentUser } from "@/lib/session";
import { getProjectImageUrlUseCase } from "@/use-cases/files";
import { NextResponse } from "next/server";

export const GET = async (
  req: Request,
  { params }: { params: { projectId: string; imageId: string } }
) => {
  try {
    const projectId = parseInt(params.projectId);

    const user = await getCurrentUser();

    const url =
      params.imageId === "default"
        ? `${env.HOSTNAME}/project.jpeg`
        : await getProjectImageUrlUseCase(user, {
            imageId: params.imageId,
            projectId,
          });

    return streamImageFromUrl(url);
  } catch (error) {
    const err = error as Error;
    return NextResponse.json({ error: err.message }, { status: 400 });
  }
};
