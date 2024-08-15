import { ComingSoon } from "@/app/(coming-soon)/coming-soon"
import { DemoSection } from "@/app/(landing)/_sections/demo"
import { FaqSection } from "@/app/(landing)/_sections/faq"
import { FeaturesSection } from "@/app/(landing)/_sections/features"
import { HeroSection } from "@/app/(landing)/_sections/hero"
import { NewsletterSection } from "@/app/(landing)/_sections/newsletter"
import { PricingSection } from "@/app/(landing)/_sections/pricing"
import { TestimonalsSection } from "@/app/(landing)/_sections/testimonals"
import { TheProblemSection } from "@/app/(landing)/_sections/the-problem"

import { appConfig } from "@/app-config"
import { getUserPlanUseCase } from "@/use-cases/subscriptions"
import { getCurrentUser } from "@/lib/session"
import { IntroductionSection } from "./_sections/introduction"

export default async function Home() {
  if (appConfig.mode === "comingSoon") {
    return <ComingSoon />
  }

  if (appConfig.mode === "maintence") {
    return (
      <div>
        <h1>Maintence</h1>
      </div>
    )
  }

  if (appConfig.mode === "live") {
    const user = await getCurrentUser()
    const hasSubscription = user ? (await getUserPlanUseCase(user.id)) !== "free" : false

    return (
      <div>
        <HeroSection />
        <Separator />
        <IntroductionSection />
        {/*
        <PricingSection hasSubscription={hasSubscription} />
        */}
      </div>
    )
  }
}

function Separator() {
  return (
    <div className="bg-white dark:bg-gray-900">
      <svg
        width="100%"
        height="100%"
        id="svg"
        viewBox="0 0 1440 200"
        xmlns="http://www.w3.org/2000/svg"
        className="transition duration-300 ease-in-out delay-150"
      >
        <path
          d="M 0,400 L 0,0 C 150.40000000000003,63.60000000000001 300.80000000000007,127.20000000000002 475,155 C 649.1999999999999,182.79999999999998 847.2,174.8 1012,143 C 1176.8,111.2 1308.4,55.6 1440,0 L 1440,400 L 0,400 Z"
          stroke="none"
          strokeWidth="0"
          fillOpacity="1"
          className="fill-gray-200 dark:fill-[#020817] transition-all duration-300 ease-in-out delay-150 path-0"
        ></path>
      </svg>
    </div>
  )
}
