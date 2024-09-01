import Link from "next/link";
import { Spotlight } from "./ui/Spotlight";
import { Button } from "./ui/moving-border";
import { TextGenerateEffectDemo } from "./MyText";
function HeroSection() {
  return (
    <div
      className="h-auto md:h-[40rem] w-full rounded-md flex flex-col item-center justify-center  mx-auto py-10 md:py-0
    relative overflow-hidden"
    >
      <div className="p-4 relative z-10 w-full text-center">
        <h1 className="mt-20 md:mt-0 text-2xl md:text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-b from-neutral-50 to-neutral-400">
          GameSense: Automated Sports Insights
        </h1>

        <TextGenerateEffectDemo
          words={`GameSense leverages computer vision and AI/ML to revolutionize sports
          analytics for two-player games like badminton. Key features include player and ball tracking, event
          detection, automated score-keeping, and detailed metrics. An ambitious
          goal is live commentary, showcasing AI’s role in sports broadcasting.
          Future plans include expanding to doubles games to further enhance the
          spectator experience.`}
        />

        <div className="mt-4">
          <Link href={"/courses"}>
            <Button
              borderRadius="1.75rem"
              className="bg-black  text-black dark:text-white border-neutral-200 dark:border-blue-800"
            >
              LETS GO
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}

export default HeroSection;
