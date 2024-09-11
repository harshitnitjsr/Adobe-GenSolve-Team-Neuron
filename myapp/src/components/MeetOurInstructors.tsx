"use client";
import React from "react";
import { WavyBackground } from "./ui/wavy-background";

import { AnimatedTooltip } from "./ui/animated-tooltip";
import img from "../../public/Screenshot (1).png";
const people = [
  {
    id: 1,
    name: "Harshit Shrivastav",
    designation: "Backend , Frontend and Computer Vision",
    image:
      "https://images.unsplash.com/photo-1599566150163-29194dcaad36?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=3387&q=80",
  },
  {
    id: 2,
    name: "Pratap Kumar",
    designation: "Computer Vision , Backend and Deep Learning",
    image:
      "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8YXZhdGFyfGVufDB8fDB8fHww&auto=format&fit=crop&w=800&q=60",
  },
  {
    id: 3,
    name: "Abhijeet Kumar Trivedi",
    designation: "Frontend and Backend",
    image:
      "https://images.unsplash.com/photo-1599566150163-29194dcaad36?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=3387&q=80",
  },
];
function MeetOurInstructors() {
  return (
    <div className="relative h-[40rem] overflow-hidden flex items-center justify-center">
      <WavyBackground className="max-w-4xl mx-auto pb-40 ">
        <h2 className="text-2xl md:text-4xl lg:text-7xl text-white font-bold text-center mb-8">
          Meet Our Team
        </h2>
        <p className="text-base md:text-lg text-white items-center mb-4">
          Lorem ipsum dolor sit amet consectetur adipisicing elit. Similique
          pariatur error qui? Dolore similique, amet, aperiam eos libero magnam,
          ea nihil consequuntur quia quos dolor ut officia. Vero, magni
          repellat!
        </p>
        <div className="flex flex-row items-center justify-center mb-10 w-full ">
          <AnimatedTooltip items={people} />
        </div>
      </WavyBackground>
    </div>
  );
}

export default MeetOurInstructors;
