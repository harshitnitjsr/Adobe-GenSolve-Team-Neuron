"use client";
import { TypewriterEffectSmooth } from "./ui/typewriter-effect";
export function TypewriterEffectSmoothDemo() {
  const words = [
    {
      text: "Gensolve.",
      className: "text-red-500 dark:text-red-500 bg-blue",
    },
  ];
  return <TypewriterEffectSmooth words={words} />;
}
