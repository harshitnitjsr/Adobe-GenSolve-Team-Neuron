"use client";
import { InfiniteMovingCards } from "./ui/infinite-moving-cards";

const musictestimonial = [
  {
    quote:
      "Success is not final, failure is not fatal: It is the courage to continue that counts.",
    name: "Winston Churchill",
    title: "Former Prime Minister of the United Kingdom",
  },
  {
    quote: "The only way to do great work is to love what you do.",
    name: "Steve Jobs",
    title: "Co-founder of Apple Inc.",
  },
  {
    quote:
      "In the end, it's not the years in your life that count. It's the life in your years.",
    name: "Abraham Lincoln",
    title: "16th President of the United States",
  },
  {
    quote: "You miss 100% of the shots you don't take.",
    name: "Wayne Gretzky",
    title: "Professional Hockey Player",
  },
  {
    quote: "Believe you can and you're halfway there.",
    name: "Theodore Roosevelt",
    title: "26th President of the United States",
  },
  {
    quote: "It always seems impossible until it's done.",
    name: "Nelson Mandela",
    title: "Former President of South Africa",
  },
  {
    quote: "Stay hungry, stay foolish.",
    name: "Steve Jobs",
    title: "Co-founder of Apple Inc.",
  },
  {
    quote:
      "The only limit to our realization of tomorrow will be our doubts of today.",
    name: "Franklin D. Roosevelt",
    title: "32nd President of the United States",
  },
  {
    quote: "Life is what happens when you're busy making other plans.",
    name: "John Lennon",
    title: "Singer-songwriter",
  },
  {
    quote:
      "The best time to plant a tree was 20 years ago. The second best time is now.",
    name: "Chinese Proverb",
    title: "Unknown",
  },
  {
    quote:
      "The future belongs to those who believe in the beauty of their dreams.",
    name: "Eleanor Roosevelt",
    title: "Former First Lady of the United States",
  },
  {
    quote: "Strive not to be a success, but rather to be of value.",
    name: "Albert Einstein",
    title: "Theoretical Physicist",
  },
  {
    quote:
      "Two things are infinite: the universe and human stupidity; and I'm not sure about the universe.",
    name: "Albert Einstein",
    title: "Theoretical Physicist",
  },
  {
    quote: "Don't cry because it's over, smile because it happened.",
    name: "Dr. Seuss",
    title: "Author",
  },
  {
    quote: "Be yourself; everyone else is already taken.",
    name: "Oscar Wilde",
    title: "Writer and Poet",
  },
  {
    quote: "Be the change that you wish to see in the world.",
    name: "Mahatma Gandhi",
    title: "Leader of the Indian independence movement",
  },
  {
    quote: "You must be the change you wish to see in the world.",
    name: "Mahatma Gandhi",
    title: "Leader of the Indian independence movement",
  },
  {
    quote: "I have not failed. I've just found 10,000 ways that won't work.",
    name: "Thomas A. Edison",
    title: "Inventor and Businessman",
  },
  {
    quote:
      "The only thing necessary for the triumph of evil is for good men to do nothing.",
    name: "Edmund Burke",
    title: "Irish Statesman and Philosopher",
  },
  {
    quote:
      "Success is not the key to happiness. Happiness is the key to success. If you love what you are doing, you will be successful.",
    name: "Albert Schweitzer",
    title: "Philosopher, Theologian, and Physician",
  },
  {
    quote:
      "Happiness is not something ready-made. It comes from your own actions.",
    name: "Dalai Lama",
    title: "Spiritual Leader of Tibet",
  },
  {
    quote:
      "The only limit to our realization of tomorrow is our doubts of today.",
    name: "Franklin D. Roosevelt",
    title: "32nd President of the United States",
  },
  {
    quote: "The way to get started is to quit talking and begin doing.",
    name: "Walt Disney",
    title: "Co-founder of The Walt Disney Company",
  },
  {
    quote: "Your time is limited, don't waste it living someone else's life.",
    name: "Steve Jobs",
    title: "Co-founder of Apple Inc.",
  },
  {
    quote:
      "Life is not measured by the number of breaths we take, but by the moments that take our breath away.",
    name: "Maya Angelou",
    title: "American Poet, Singer, and Civil Rights Activist",
  },
  {
    quote:
      "Don't judge each day by the harvest you reap but by the seeds that you plant.",
    name: "Robert Louis Stevenson",
    title: "Scottish Novelist and Poet",
  },
  {
    quote: "The only way to do great work is to love what you do.",
    name: "Steve Jobs",
    title: "Co-founder of Apple Inc.",
  },
  {
    quote: "Don't let yesterday take up too much of today.",
    name: "Will Rogers",
    title: "American Stage and Film Actor",
  },
  {
    quote: "It's not whether you get knocked down, it's whether you get up.",
    name: "Vince Lombardi",
    title: "American Football Coach",
  },
  {
    quote:
      "The road to success and the road to failure are almost exactly the same.",
    name: "Colin R. Davis",
    title: "English Conductor for London Symphony Orchestra",
  },
  {
    quote:
      "What you get by achieving your goals is not as important as what you become by achieving your goals.",
    name: "Zig Ziglar",
    title: "American Author, Salesperson, and Motivational Speaker",
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
