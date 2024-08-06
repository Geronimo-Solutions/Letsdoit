import Image from "next/image"

export function IntroductionSection() {
  return (
    <div className="flex flex-col items-start align-center md:flex-row gap-x-24 w-3/4 mx-auto my-16 bg-gray-200 dark:bg-background">
      <section className="flex-1">
        <div className="">
          <p className="text-4xl mb-12 max-w-4xl mx-auto text-left">
            Connect with
            <span className="font-bold"> Like-Minded </span>
            Individuals
          </p>
        </div>
        <div className="">
          <p className="mt-5 text-gray-400 text-lg">
            Our online service makes it easy to connect with others who share their ideas,
            whether it's tech, wellness, or hobby. Create or join a project, schedule
            meetups, and enjoy pursuing your dreams with new friends by your side. Start
            your new journey today!
          </p>
        </div>
      </section>
      <section className="flex-1">
        <div className="">
          <Image
            className="rounded-xl w-[400px] h-[400px]"
            width="200"
            height="200"
            src="/project.jpeg"
            alt="hero image"
          />
        </div>
      </section>
    </div>
  )
}
