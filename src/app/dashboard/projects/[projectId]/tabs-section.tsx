"use client";

import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { cn } from "@/lib/utils";
import { tabStyles } from "@/styles/common";
import Link from "next/link";
import { usePathname } from "next/navigation";

export function TabsSection({
  projectId,
  showSettings,
}: {
  projectId: string;
  showSettings: boolean;
}) {
  const path = usePathname();
  const tabInUrl = path.includes("/posts") ? "posts" : path.split("/").pop();

  return (
    <div className={tabStyles}>
      <div className="container mx-auto">
        <Tabs value={tabInUrl} defaultValue={tabInUrl} activationMode="manual">
          <TabsList className="flex-wrap space-x-4 bg-inherit h-fit">
            <TabsTrigger asChild value="info">
              <Link href={`/dashboard/projects/${projectId}/info`}>Info</Link>
            </TabsTrigger>

            <TabsTrigger asChild value="posts">
              <Link href={`/dashboard/projects/${projectId}/posts`}>Posts</Link>
            </TabsTrigger>

            <TabsTrigger asChild value="events">
              <Link href={`/dashboard/projects/${projectId}/events`}>Events</Link>
            </TabsTrigger>

            <TabsTrigger asChild value="members">
              <Link href={`/dashboard/projects/${projectId}/members`}>Members</Link>
            </TabsTrigger>

            {showSettings && (
              <>
                <TabsTrigger asChild value="settings">
                  <Link href={`/dashboard/projects/${projectId}/settings`}>
                    Settings
                  </Link>
                </TabsTrigger>

                <TabsTrigger asChild value="danger">
                  <Link href={`/dashboard/projects/${projectId}/danger`}>
                    Danger
                  </Link>
                </TabsTrigger>
              </>
            )}
          </TabsList>
        </Tabs>
      </div>
    </div>
  );
}
