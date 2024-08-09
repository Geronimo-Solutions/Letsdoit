import "@/app/globals.css"
import "fumadocs-ui/style.css"
import type { Metadata } from "next"
import NextTopLoader from "nextjs-toploader"
import { Toaster } from "@/components/ui/toaster"
import { cn } from "@/lib/utils"
import { ReactNode, Suspense } from "react"
import { Providers } from "@/providers/providers"
import { Footer } from "@/components/footer"
import { applicationName, appConfig } from "@/app-config"
import PostHogPageView from "@/components/posthog-page-view"
import { ComingSoonFooter } from "@/app/(coming-soon)/footer"
import { Header } from "@/app/_header/header"

import { Archivo } from "next/font/google"
import { Libre_Franklin } from "next/font/google"

const archivo = Archivo({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-archivo",
})
const libre_franklin = Libre_Franklin({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-libre_franklin",
})

const { mode } = appConfig

export const metadata: Metadata = {
  title: applicationName,
  icons: [{ rel: "icon", type: "image/png", sizes: "48x48", url: "/favicon.ico" }],
  keywords:
    "next.js, entrepreneurship, Social App, Ideas, Collaborating, Collaboration, Task management, Productivity tools, To-do list app, Task organizer, Daily planner, Time management, Goal setting, Task tracker, Project management, Personal productivity, Task reminders, Task scheduler, Task prioritization, Workflow automation, Task collaboration, Team productivity, Online to-do list, Task planning, Efficiency tools, Task completion",
  description:
    "Share any project idea you may have. Let other like-minded people find you and connect with you. We all have amazing ideas, together we can realize them.",
  openGraph:
    mode === "comingSoon"
      ? {
          title: "letsdoit.today",
          description: "Coming Soon",
          url: "https://letsdoit.today",
          siteName: "Letsdoit",
          type: "website",
          images: [
            {
              url: "https://letsdoit/project.png",
              secureUrl: "https://letsdoit/project.png",
              width: 800,
              height: 418,
              alt: "Letsdoit social media card image",
            },
          ],
        }
      : undefined,
}

export default async function RootLayout({
  children,
}: Readonly<{
  children: ReactNode
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={cn(
          "min-h-screen bg-background antialiased",
          archivo.variable + " " + libre_franklin.variable
        )}
      >
        <Providers>
          <Suspense>
            <PostHogPageView />
          </Suspense>
          <NextTopLoader />
          <div className="flex flex-col w-full h-screen">
            {appConfig.mode === "live" && <Header />}
            <div>{children}</div>
            {appConfig.mode === "comingSoon" ? <ComingSoonFooter /> : <Footer />}
          </div>
        </Providers>
        <Toaster />
      </body>
    </html>
  )
}
