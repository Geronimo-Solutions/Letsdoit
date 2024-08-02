import { SignedIn } from "@/components/auth"
import { SignedOut } from "@/components/auth"
import Container from "@/components/container"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import Image from "next/image"
import Link from "next/link"

export function HeroSection() {
  return (
    <div className="bg-white dark:bg-gray-900">
      <Container>
        <div className="flex flex-col md:flex-row gap-y-14 w-full justify-between">
          <div className="">
            <Badge className="text-sm md:text-base">
              Discover like-minded individuals
            </Badge>
            <h1 className="text-5xl md:text-7xl max-w-3xl mt-10 leading-[1.2] font-semibold">
              Create and Discover New Projects
            </h1>
            <p className="mt-5 text-gray-500 text-lg max-w-[600px]">
              Our online service makes it easy to connect with others who share their
              ideas, whether it's tech, wellness, or hobby. Create or join a project,
              schedule meetups, and enjoy pursuing your dreams with new friends by your
              side. Start your new journey today!
            </p>
            <div className="space-y-4 sm:flex sm:space-y-0 sm:space-x-4 mt-10">
              <SignedIn>
                <Button asChild>
                  <Link href={"/dashboard"}>View Dashboard</Link>
                </Button>
              </SignedIn>

              <SignedOut>
                <Button asChild>
                  <Link href="/sign-up">Create an account</Link>
                </Button>
              </SignedOut>
            </div>
          </div>
          <Image
            className="rounded-xl w-[400px] h-[400px]"
            width="200"
            height="200"
            src="/project.jpeg"
            alt="hero image"
          />
        </div>
      </Container>
    </div>
  )
}
