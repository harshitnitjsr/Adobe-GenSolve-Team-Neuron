"use client";

import Image from "next/image";
import { ref, onValue } from "firebase/database";
import { database } from "../../utils/firebase";
import React, { useEffect, useState } from "react";
import { CardBody, CardContainer, CardItem } from "../../components/ui/3d-card";
import Link from "next/link";
import data from "../../data/data.json";
import { Button } from "@/components/ui/moving-border";
import { BackgroundGradient } from "@/components/ui/background-gradient";
import { Spotlight } from "@/components/ui/Spotlight";
import { TypewriterEffectSmoothDemo } from "@/components/Name";

export default function Harshit() {
  const [matchData, setMatchData] = useState(null);

  useEffect(() => {
    const matchDataRef = ref(database, "liveMatch");

    const unsubscribe = onValue(matchDataRef, (snapshot) => {
      const data = snapshot.val();
      setMatchData(data);
    });

    return () => unsubscribe();
  }, []);

  return (
    <>
      <div className="min-h-screen bg-black py-12 pt-36">
        <Spotlight
          className="-top-40 left-0 md:left-60 md:-top-20"
          fill="white"
        />
        <TypewriterEffectSmoothDemo />
        <h1 className="text-lg md:text-7xl text-center font-sans font-bold mb-8 text-white">
          Video with analysis
        </h1>
        <div className="flex flex-wrap justify-center">
          <div className="min-h-screen bg-black py-12 pt-36">
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
                  <h1>
                    <p>
                      <h1 className="text-lg md:text-1xl text-center font-sans font-bold mb-8 text-white">
                        Player 1
                      </h1>
                      <h1 className="text-lg md:text-7xl text-center font-sans font-bold mb-8 text-white">
                        {matchData?.liveScore["Player 1"]}
                      </h1>
                    </p>
                    <p>
                      <h1 className="text-lg md:text-1xl text-center font-sans font-bold mb-8 text-white">
                        Player 2
                      </h1>
                      <h1 className="text-lg md:text-7xl text-center font-sans font-bold mb-8 text-white">
                        {matchData?.liveScore["Player 2"]}
                      </h1>
                    </p>
                  </h1>
                </CardItem>
              </CardBody>
            </CardContainer>
          </div>

          {matchData && (
            <div className="flex flex-wrap justify-center gap-4 mt-8">
              {matchData?.scoreArray?.slice(-5).map((shot, index) => (
                <BackgroundGradient
                  key={index}
                  className="rounded-[22px] p-4 sm:p-10 bg-white dark:bg-zinc-900 overflow-hidden h-[300px] w-[200px]"
                >
                  <div className="p-4 sm:p-6 flex flex-col items-center text-center flex-grow">
                    <p className="text-lg sm:text-xl text-black mt-4 mb-2 dark:text-neutral-200">
                      {shot.player}
                    </p>
                    <p className="text-sm text-neutral-600 dark:text-neutral-400 flex-grow">
                      {`Distance: ${shot.distance}`}
                    </p>
                    <p className="text-sm text-neutral-600 dark:text-neutral-400 flex-grow">
                      {`Speed: ${shot.speed}`}
                    </p>
                  </div>
                </BackgroundGradient>
              ))}
            </div>
          )}

          <img
            src="http://localhost:5000/yolo_video_feed"
            alt="YOLO Webcam Stream"
            style={{ width: "100vw", height: "600px" }}
          />
        </div>
      </div>
    </>
  );
}
