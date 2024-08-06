import { SignedIn } from "@/components/auth"
import { SignedOut } from "@/components/auth"
import Container from "@/components/container"
import { DashedArrow } from "@/components/icons"
import { Button } from "@/components/ui/button"
import Link from "next/link"

export function HeroSection() {
  return (
    <div className="bg-white dark:bg-gray-900">
      <Container>
        <div className="flex flex-col gap-y-4 items-center text-center">
          {/* 
          <Badge className="text-sm md:text-base"></Badge>
          */}
          <h1 className="text-5xl md:text-7xl mt-10 leading-[1.2] font-semibold">
            Create and Discover New Projects
          </h1>
          <p className="mt-5 leading-relaxed text-gray-400 text-lg max-w-[600px]">
            Made for people with amazing ideas. Directory of sharable projects with tools
            to
            <span className="font-bold"> build and engage with communities.</span> Start
            your journey today.
            {/*
             */}
          </p>
          <div className="relative space-y-4 sm:flex items-center justify-center sm:space-y-0 space-x-4 mt-10">
            <DashedArrow className="hidden sm:inline absolute -bottom-[4rem] -left-[4rem] w-20 h-auto fill-current" />
            <SignedIn>
              <Button asChild>
                <Link href={"/dashboard"}>View Dashboard</Link>
              </Button>
            </SignedIn>
            <SignedIn>
              <Button variant={"outline"} asChild>
                <Link href={"/dashboard"}>View Dashboard</Link>
              </Button>
            </SignedIn>

            <SignedOut>
              <Button asChild>
                <Link href={"/browse"}>Browse Projects</Link>
              </Button>
            </SignedOut>
            <SignedOut>
              <Button variant={"outline"} asChild>
                <Link href={"/sign-in"}>Create an Account</Link>
              </Button>
            </SignedOut>
          </div>
        </div>
      </Container>
    </div>
  )
}
