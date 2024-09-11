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
      "https://media.licdn.com/dms/image/v2/D4D03AQGVRCU-YeZUoA/profile-displayphoto-shrink_400_400/profile-displayphoto-shrink_400_400/0/1685977384203?e=1731542400&v=beta&t=NFMvVh5d43n3s4SNhBiWfLWEjFMszqa1RDep0k3fpDQ",
  },
  {
    id: 2,
    name: "Pratap Kumar",
    designation: "Computer Vision , Backend and Deep Learning",
    image:
      "https://media.licdn.com/dms/image/v2/D4D03AQFjjcefi_huuA/profile-displayphoto-shrink_400_400/profile-displayphoto-shrink_400_400/0/1720455958378?e=1731542400&v=beta&t=3bVROC5rHPI0dpXMwD4EZMmqg3kRpW6b9NLgL_VNNec",
  },
  {
    id: 3,
    name: "Abhijeet Kumar Trivedi",
    designation: "Frontend and Backend",
    image:
      "https://media.licdn.com/dms/image/v2/D4D03AQFYKOi9jzQdxA/profile-displayphoto-shrink_400_400/profile-displayphoto-shrink_400_400/0/1696354174274?e=1731542400&v=beta&t=9ADgG9ILgvv5DBcQx62h5euV6HbGQPp88iyWgJBk5Qg",
  },
];
function MeetOurInstructors() {
  return (
    <div className="relative h-[40rem] overflow-hidden flex items-center justify-center">
      <WavyBackground className="max-w-4xl mx-auto pb-40 ">
        <h2 className="text-2xl md:text-4xl lg:text-7xl text-white font-bold text-center mb-8">
          Meet Our Team
        </h2>
        <p className="text-base md:text-lg text-white items-center mb-4 ">
          Our Frontend Developers bring your ideas to life with intuitive,
          responsive, and engaging user interfaces. Our Backend Experts ensure a
          seamless and secure experience, managing data flow and building
          scalable architectures. Our Computer Vision Engineers harness the
          power of AI to interpret visual data, enabling innovative, real-time
          solutions. Together, we create cutting-edge technology that drives
          impact across every project.
        </p>
        <div className="flex flex-row items-center justify-center mb-10 w-full ">
          <AnimatedTooltip items={people} />
        </div>
      </WavyBackground>
    </div>
  );
}

export default MeetOurInstructors;
