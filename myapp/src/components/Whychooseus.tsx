"use client";
import React from "react";
import { StickyScroll } from "./ui/sticky-scroll-reveal";
import Image from "next/image";
import img from "../../public/Screenshot (1).png";
const musicschool = [
  {
    title: "Collaborative Team Play",
    description:
      "Badminton is a game of speed and strategy, and teamwork is crucial. Practice and play together with your partner, syncing movements, strategies, and reflexes. Master the art of collaboration on the court and dominate your opponents with seamless coordination.",
    content: (
      <div className="h-full w-full bg-[linear-gradient(to_bottom_right,var(--cyan-500),var(--emerald-500))] flex items-center justify-center text-white">
        <p>Collaborative Team Play</p>
      </div>
    ),
  },
  {
    title: "Real-time Reaction Training",
    description:
      "In badminton, every second counts. Develop your reaction time to handle every smash, drop, and clear in real time. Experience immersive training with drills that simulate live match conditions, tracking your every move.",
    content: (
      <div className="h-full w-full  flex items-center justify-center text-white">
        Real-Time Reaction Training
      </div>
    ),
  },
  {
    title: "Match Strategy and Control",
    description:
      "Master the game with deep strategy. Understand your opponents' weaknesses and plan your moves in advance. Our platform provides detailed analytics to enhance your game awareness, enabling real-time decisions and perfect execution.",
    content: (
      <div className="h-full w-full bg-[linear-gradient(to_bottom_right,var(--orange-500),var(--yellow-500))] flex items-center justify-center text-white">
        <p>Match Strategy and Control</p>
      </div>
    ),
  },
  {
    title: "Endurance and Focus Training",
    description:
      "Every match is a test of endurance and mental strength. Build up your stamina and focus through advanced training programs designed for badminton players. Our drills will push your limits and help you stay sharp even in long rallies.",
    content: (
      <div className="h-full w-full bg-[linear-gradient(to_bottom_right,var(--cyan-500),var(--emerald-500))] flex items-center justify-center text-white">
        Endurance and Focus Training
      </div>
    ),
  },
];

function Whychooseus() {
  return (
    <div>
      <StickyScroll content={musicschool} />
    </div>
  );
}

export default Whychooseus;
