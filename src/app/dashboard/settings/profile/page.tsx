import { ProfileImage } from "@/app/dashboard/settings/profile/profile-image"
import { ProfileName } from "@/app/dashboard/settings/profile/profile-name"
import { EditBioForm } from "./edit-bio-form"
import { getCurrentUser } from "@/lib/session"
import { Suspense } from "react"
import { Skeleton } from "@/components/ui/skeleton"
import { ConfigurationPanel } from "@/components/configuration-panel"
import { getUserProfileLoader } from "../../projects/[projectId]/posts/[postId]/loaders"

export default async function SettingsPage() {
  async function BioFormWrapper() {
    const user = await getCurrentUser()

    if (!user) {
      throw new Error("User not found")
    }

    const profile = await getUserProfileLoader(user.id)

    return <EditBioForm bio={profile.bio} />
  }

  return (
    <div className="space-y-8">
      <div className="grid grid-cols-2 gap-8">
        <ProfileImage />
        <ProfileName />
      </div>

      <ConfigurationPanel title="Profile Bio">
        <Suspense fallback={<Skeleton className="w-full h-[400px] rounded" />}>
          <BioFormWrapper />
        </Suspense>
      </ConfigurationPanel>
    </div>
  )
}
