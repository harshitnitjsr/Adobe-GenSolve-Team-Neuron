"use client";

import Image from "next/image";
import { useState, useEffect } from "react";
import axios from "axios";
import Link from "next/link";
import { CardBody, CardContainer, CardItem } from "../../components/ui/3d-card";
import { BackgroundGradient } from "@/components/ui/background-gradient";
import { Spotlight } from "@/components/ui/Spotlight";
import { TypewriterEffectSmoothDemo } from "@/components/Name";
import { LampDemo } from "@/components/MyLamp";
import { CardSpotlightDemo } from "@/components/MySpecialCard";
import { CardSpotlightDemoScore } from "@/components/MyScore";

export default function Harshit() {
  const [matchData, setMatchData] = useState(null);
  const [score, setScore] = useState(null);

  useEffect(() => {
    const fetchMatchData = async () => {
      try {
        const response = await axios.get(
          "http://localhost:5000/get_match_data"
        );
        setMatchData(response.data);
      } catch (error) {
        console.error("Error fetching the match data:", error);
      }
    };

    const fetchScore = async () => {
      try {
        const response = await axios.get(
          "http://localhost:5000/generating_live_score"
        );
        setScore(response.data.score);
      } catch (error) {
        console.error("Error fetching the live score:", error);
      }
    };

    fetchMatchData();
    fetchScore();

    // Fetch data every 5 seconds
    const interval = setInterval(() => {
      fetchMatchData();
      fetchScore();
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  return (
    <>
      <div className="min-h-screen bg-slate-950 py-12 pt-36">
        <TypewriterEffectSmoothDemo />
        <LampDemo first={"Video without CV Integration"}>
          <div className="flex flex-wrap justify-center bg-slate-950">
            <div className="min-h-screen bg-slate-950 py-12 pt-36">
              <BackgroundGradient key={1} className="rounded-[22px]">
                <h1 className="text-lg md:text-4xl text-center font-sans font-bold mb-8 text-red-300">
                  {"Status"}
                </h1>
                <h1 className="text-lg md:text-5xl text-center  font-sans font-bold mb-8 text-white">
                  {"HIT"}
                </h1>
              </BackgroundGradient>
              <CardContainer key={1} className="inter-var m-4">
                <CardBody className="bg-gray-50 relative group/card dark:hover:shadow-2xl dark:hover:shadow-emerald-500/[0.1] dark:bg-black dark:border-white/[0.2] border-black/[0.1] w-auto sm:w-[30rem] h-auto rounded-xl p-6 border">
                  <CardItem
                    translateZ="50"
                    className="text-xl font-bold text-neutral-600 dark:text-white"
                  >
                    {"Live Score"}
                  </CardItem>
                  <CardItem
                    as="p"
                    translateZ="60"
                    className="text-neutral-500 text-sm max-w-sm mt-2 dark:text-neutral-300"
                  >
                    {"Find Live Score of Badminton"}
                  </CardItem>

                  <CardItem translateZ="100" className="w-full mt-4">
                    <CardSpotlightDemoScore
                      player1={matchData?.liveScore["Player 1"]}
                      player2={matchData?.liveScore["Player 2"]}
                    />
                  </CardItem>
                </CardBody>
              </CardContainer>
            </div>
            <div className="relative z-1 flex flex-wrap justify-center m-10">
              <div className="relative z-20 w-full max-w-[960px]">
                <img
                  src="http://localhost:5000/actula-video-feed"
                  width="960"
                  height="720"
                  className="border border-gray-200 rounded-lg"
                />
              </div>
            </div>

            {matchData && (
              <>
                <div className="flex flex-wrap justify-center gap-7 mt-8">
                  <br />
                  {matchData && (
                    <>
                      <div className="flex flex-wrap justify-center gap-7 mt-8">
                        {/* <h1 className="text-lg md:text-xl  font-sans font-bold mb-8 text-red-600">
                    Last 6 shots details
                  </h1> */}

                        <br />
                        {matchData?.scoreArray?.slice(-8).map((shot, index) => (
                          <BackgroundGradient
                            key={index}
                            className="rounded-[22px]"
                          >
                            <CardSpotlightDemo
                              shot_number={index}
                              prop={shot.distance}
                              speed={shot.speed}
                              player={shot.player}
                            />
                          </BackgroundGradient>
                        ))}
                      </div>
                    </>
                  )}
                </div>
              </>
            )}
          </div>
        </LampDemo>

        <Link href={"/courses"} className="m-6 p-4 w-auto max-w-xs">
          <BackgroundGradient key={1} className="rounded-[12px] p-4">
            <h1 className="text-base md:text-lg text-center font-sans font-bold mb-4 text-red-300">
              {"Show Video with Analytics and CV integration"}
            </h1>
          </BackgroundGradient>
        </Link>
      </div>
    </>
  );
}
