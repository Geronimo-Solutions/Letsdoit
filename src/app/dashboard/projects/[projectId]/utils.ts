import { useSafeParams } from "@/lib/params";
import { z } from "zod";

export function useProjectIdParam() {
  const { projectId } = useSafeParams(
    z.object({ projectId: z.string().pipe(z.coerce.number()) })
  );
  return projectId;
}
