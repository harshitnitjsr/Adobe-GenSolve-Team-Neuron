"use client";
import { InfiniteMovingCards } from "./ui/infinite-moving-cards";

const musictestimonial = [
  {
    quote:
      "The shuttlecock doesn’t fly itself; it's the dedication and persistence that propel it.",
    name: "P. Gopichand",
    title: "Chief National Coach of the Indian Badminton Team",
  },
  {
    quote:
      "A champion is defined not by their victories, but by how they can recover when they fall.",
    name: "Carolina Marin",
    title: "Olympic Gold Medalist, Badminton",
  },
  {
    quote:
      "Badminton is not just about power; it's about skill, strategy, and endurance.",
    name: "Lin Dan",
    title: "Two-time Olympic Badminton Champion",
  },
  {
    quote:
      "In badminton, every shuttle counts. Every moment on court is an opportunity to outthink your opponent.",
    name: "Viktor Axelsen",
    title: "World Champion, Badminton",
  },
  {
    quote:
      "You miss 100% of the smashes you don’t take, so take every chance you get.",
    name: "Lee Chong Wei",
    title: "Three-time Olympic Badminton Silver Medalist",
  },
  {
    quote: "Believe in your training and stay focused on the next rally.",
    name: "Saina Nehwal",
    title: "Olympic Bronze Medalist, Badminton",
  },
  {
    quote: "It always seems impossible until you win the final point.",
    name: "Kento Momota",
    title: "World Champion, Badminton",
  },
  {
    quote:
      "The only limit to your game is the limit you place on yourself. Play with heart and passion.",
    name: "Ratchanok Intanon",
    title: "World Champion, Badminton",
  },
  {
    quote: "Life is what happens between rallies; stay calm and keep playing.",
    name: "Taufik Hidayat",
    title: "Olympic Gold Medalist, Badminton",
  },
  {
    quote:
      "The best time to improve your game was yesterday. The second best time is now.",
    name: "Kevin Sanjaya Sukamuljo",
    title: "World No. 1 Men's Doubles Player",
  },
  {
    quote:
      "The future of badminton belongs to those who believe in the beauty of every shot.",
    name: "Tai Tzu-ying",
    title: "World No. 1 Women's Singles Player",
  },
  {
    quote:
      "Strive not to win every match, but to play every shot with precision.",
    name: "Chen Long",
    title: "Olympic Gold Medalist, Badminton",
  },
  {
    quote:
      "Two things are infinite: the number of shuttles in a match and the lessons you learn from playing.",
    name: "Kidambi Srikanth",
    title: "Former World No. 1, Badminton",
  },
  {
    quote:
      "Don't cry over missed shots, smile because you have the chance to play again.",
    name: "Zhang Ning",
    title: "Two-time Olympic Gold Medalist, Badminton",
  },
  {
    quote: "Be yourself on court; every opponent is already taken.",
    name: "Akane Yamaguchi",
    title: "World Champion, Badminton",
  },
  {
    quote:
      "You must be the change you wish to see in your game, one rally at a time.",
    name: "PV Sindhu",
    title: "Olympic Silver Medalist, Badminton",
  },
  {
    quote: "I've found thousands of ways to improve my footwork.",
    name: "Marcus Fernaldi Gideon",
    title: "World No. 1 Men's Doubles Player",
  },
  {
    quote:
      "The only thing necessary for winning is to never give up after losing a point.",
    name: "Jan O. Jørgensen",
    title: "Former World No. 2, Badminton",
  },
  {
    quote:
      "Success in badminton isn’t about winning every rally, but loving every second on the court.",
    name: "Zhao Yunlei",
    title: "Olympic Gold Medalist, Badminton",
  },
  {
    quote:
      "Happiness in badminton comes from the rallies you fight for, not the points handed to you.",
    name: "Yuta Watanabe",
    title: "World No. 1 Mixed Doubles Player",
  },
  {
    quote:
      "The only limit to our improvement tomorrow is the hesitation to train today.",
    name: "Mads Pieler Kolding",
    title: "Danish Badminton Player",
  },
  {
    quote: "The way to start winning is to quit doubting your next smash.",
    name: "Lee Yong-dae",
    title: "Olympic Gold Medalist, Badminton",
  },
  {
    quote:
      "Your time on court is limited, don't waste it playing anyone else's game.",
    name: "Peter Gade",
    title: "Former World No. 1, Badminton",
  },
  {
    quote:
      "Badminton is not measured by the number of wins but by the rallies that take your breath away.",
    name: "Carolina Marin",
    title: "Olympic Gold Medalist, Badminton",
  },
  {
    quote:
      "Don’t judge a match by the number of points you score but by the effort you put into every rally.",
    name: "Koo Kien Keat",
    title: "Former World No. 1, Badminton",
  },
  {
    quote: "The only way to do great rallies is to love the game you play.",
    name: "Mohammad Ahsan",
    title: "World Champion, Badminton",
  },
  {
    quote: "Don’t let a lost rally take up too much of your match.",
    name: "Hendra Setiawan",
    title: "Olympic Gold Medalist, Badminton",
  },
  {
    quote: "It's not whether you lose a point, it's whether you win the rally.",
    name: "Viktor Axelsen",
    title: "World Champion, Badminton",
  },
  {
    quote:
      "The road to victory and the road to defeat are paved with the same number of shuttles.",
    name: "Kento Momota",
    title: "World Champion, Badminton",
  },
  {
    quote:
      "What you become as a badminton player is more important than the points you achieve.",
    name: "P. V. Sindhu",
    title: "Olympic Silver Medalist, Badminton",
  },
];

function Testimonial() {
  return (
    <div className="h-[40rem] w-full dark:bg-black dark:bg-grid-white/[0.2] relative flex flex-col items-center justify-center overflow-hidden">
      <h2 className="text-3xl font-bold text-center mb-8 z-10">
        Hear our Harmony : Voices of Success
      </h2>

      <div className="absolute pointer-events-none inset-0 flex items-center justify-center dark:bg-black bg-white [mask-image:radial-gradient(ellipse_at_center,transparent_20%,black)]"></div>
      <InfiniteMovingCards
        items={musictestimonial}
        direction="right"
        speed="slow"
      />
    </div>
  );
}

export default Testimonial;
