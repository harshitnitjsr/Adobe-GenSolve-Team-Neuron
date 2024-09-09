"use client";

import Image from "next/image";
import { useState, useEffect, useRef } from "react";
import axios from "axios";
import Link from "next/link";
import { CardBody, CardContainer, CardItem } from "../../components/ui/3d-card";
import { BackgroundGradient } from "@/components/ui/background-gradient";
// import { Spotlight } from "@/components/ui/Spotlight";
import { TypewriterEffectSmoothDemo } from "@/components/Name";
import { LampDemo } from "@/components/MyLamp";
// import { CardSpotlight } from "@/components/ui/card-spotlight";
import { CardSpotlightDemo } from "@/components/MySpecialCard";
import { CardSpotlightDemoScore } from "@/components/MyScore";
import { TextToSpeech } from "@/components/Audio";

// import { run } from "@/helpers/gemini";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { WobbleCardDemo } from "@/components/Commentary";
import socket from "@/utils/socket";

export default function Harshit() {
  const [matchData, setMatchData] = useState<any>(null);
  const [score, setScore] = useState<number | null>(null);
  const [apidata, setApidata] = useState<string | null>(null);
  const [distance, setDistance] = useState<any>(null);
  const [key, setKey] = useState<any>("hello");
  const hasFetchedData = useRef(false); // Track if data has been fetched
  const [hitby, setHitby] = useState<any>(null);
  useEffect(() => {
    socket.on("update_match_data", (data) => {
      setMatchData(data);
      setHitby(data.HitPlayer);
    });

    // Cleanup on unmount
    return () => {
      socket.off("update_match_data");
    };
  }, []);
  //   const genAI = new GoogleGenerativeAI({
  //     apiKey: "AIzaSyDTJ-vtVfU7us69uv1wqz_scHHfmhoPuJU",
  //   });
  //   console.log(genAI)
  //   const model = genAI.getGenerativeModel({
  //     model: "gemini-1.5-flash",
  //     systemInstruction: "Generate small and 1 line commentary for the badminton based on my given event and some masala line on this. Masala line and commentary both inclusive make 1 line, not more than that.",
  //   });
  //   console.log(model)
  //   const generationConfig = {
  //     temperature: 2,
  //     topP: 0.95,
  //     topK: 64,
  //     maxOutputTokens: 8192,
  //     responseMimeType: "application/json",
  //   };
  //   const fetchData = async () => {
  //     try {
  //       console.log(generationConfig)
  //       const chatSession = await model.startChat({
  //         generationConfig,
  //         history: [
  //           {
  //             role: "user",
  //             parts: [
  //               { text: "Smash and player 1 scores 1 and player 2 2" },
  //             ],
  //           },
  //           {
  //             role: "model",
  //             parts: [
  //               { text: "{\"commentary\": \"What a smash! Player 1 connects with a powerful shot, but player 2 responds with two points in a row! This is getting interesting!\"}" },
  //             ],
  //           },
  //         ],
  //       });

  //       const result = await chatSession.sendMessage("player 1 scores 1 and player 2 4 and smash");
  //       console.log(result);
  //       // return result;

  //     } catch (error) {
  //       // console.log(generationConfig)
  //       console.error("Error in generating commentary:", error);
  //       throw error;
  //     }
  //   };

  //   //

  // //
  // const api= process.env.GEMINI_API_KEY
  // const

  useEffect(() => {
    const fetchData = async () => {
      // let api1=
      setKey(process.env.NEXT_PUBLIC_GEMINI_KEY!);
      // console.log(key)
      const genAI = new GoogleGenerativeAI(
        "AIzaSyAvguxIaYJqqWNrbtPEEOs7qdTih-5wGio"
      );
      const model = genAI.getGenerativeModel({
        model: "gemini-1.5-flash",
        systemInstruction:
          "Generate 15 word commentary not more than 15 words. Ensure the commentary is engaging, uses sports jargon, and adds a touch of excitement. Output the generated commentary in JSON format {commentary : data} based on my given inputs . . . and generate different type of commentary every time and use my given numerical datas too. ",
        generationConfig: { responseMimeType: "application/json" },
      });
      const lastElementPlayer1 =
        matchData?.scoreArray["Player 1"][
          matchData?.scoreArray["Player 1"].length - 1
        ];
      const lastElementPlayer2 =
        matchData?.scoreArray["Player 2"][
          matchData?.scoreArray["Player 2"].length - 1
        ];
      let prompt: string = `Player 1 score is ${lastElementPlayer1?.score} and player 2 score is ${lastElementPlayer2?.score}`;
      if (matchData?.HitPlayer == "Player 1") {
        prompt = `Player 1 hit with the speed of  ${lastElementPlayer1?.speed} at a distance of ${lastElementPlayer1?.distance} and player 1 score is ${lastElementPlayer1?.score} and player 2 score is ${lastElementPlayer2?.score} `;
      }

      if (matchData?.HitPlayer == "Player 2") {
        prompt = `Player 1 hit with the speed of  ${lastElementPlayer2?.speed} at a distance of ${lastElementPlayer2?.distance} and player 1 score is ${lastElementPlayer2?.score} and player 2 score is ${lastElementPlayer1?.score} `;
      }
      const result = await model.generateContent(prompt);
      const jsonObject = JSON.parse(result.response.text());

      setApidata(jsonObject.commentary);
      console.log(jsonObject.commentary);
    };

    fetchData();
  }, [hitby]);

  return (
    <>
      <div className="min-h-screen bg-slate-950 py-12 pt-36">
        {/* <h1>{distance}</h1> */}
        <TypewriterEffectSmoothDemo />

        <LampDemo first={"Video with Analysis"}>
          <div className="flex flex-wrap justify-center">
            <div className="min-h-screen bg-slate-950 py-12 pt-36">
              <BackgroundGradient key={1} className="rounded-[22px]">
                <h1 className="text-lg md:text-4xl text-center font-sans font-bold mb-8 text-red-300">
                  {"Status"}
                </h1>

                <h1 className="text-lg md:text-5xl text-center  font-sans font-bold mb-8 text-white">
                  {matchData?.HitPlayer}
                </h1>
              </BackgroundGradient>
              <CardContainer key={1} className="inter-var m-4">
                <CardBody className="bg-gray-50 relative group/card dark:hover:shadow-2xl dark:hover:shadow-emerald-500/[0.1] dark:bg-black dark:border-white/[0.2] border-black/[0.1] w-auto sm:w-[30rem] h-auto rounded-xl p-6 border">
                  <CardItem
                    translateZ="50"
                    className="text-xl font-bold text-neutral-600 dark:text-white"
                  >
                    {"Live Distance"}
                  </CardItem>
                  <CardItem
                    as="p"
                    translateZ="60"
                    className="text-neutral-500 text-sm max-w-sm mt-2 dark:text-neutral-300"
                  >
                    {"Find Distance Covered by each Player Here"}
                  </CardItem>
                  <CardItem translateZ="100" className="w-full mt-4">
                    <CardSpotlightDemoScore
                      player1={matchData?.playerdistance["Player 1"]}
                      player2={matchData?.playerdistance["Player 2"]}
                    />
                  </CardItem>
                </CardBody>
              </CardContainer>
            </div>
            <div className="flex flex-wrap justify-center mt-11 m-9 ml-7 gap-5">
              <div>
                <img
                  src="http://localhost:5000/yolo_video_feed"
                  width="640"
                  height="480"
                  className="border border-gray-200 rounded-lg"
                  style={{ marginTop: "95px" }}
                />
              </div>

              <div>
                <img
                  src="http://localhost:5000/match_map_feed"
                  width="640"
                  height="900"
                  className="border border-gray-200 rounded-lg"
                  style={{ height: "682px", width: "543px" }}
                />
              </div>
              <div className="relative z-1 flex flex-wrap justify-center m-10">
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
                      {"Find Live Score Here"}
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
            </div>
            {matchData && (
              <>
                <div className="flex flex-wrap justify-center gap-7 mt-8">
                  <br />
                  {matchData && (
                    <>
                      {" "}
                      <h1 className="text-lg md:text-5xl text-center  font-sans font-bold mb-8 text-white">
                        {"Player 1"}
                      </h1>
                      <div className="flex flex-wrap justify-center gap-7 mt-8">
                        {/* <h1 className="text-lg md:text-xl  font-sans font-bold mb-8 text-red-600">
                    Last 6 shots details
                  </h1> */}

                        <br />
                        {matchData?.scoreArray["Player 1"]
                          ?.slice(-4)
                          .map((shot: any, index: any) => (
                            <BackgroundGradient
                              key={index}
                              className="rounded-[22px]"
                            >
                              <CardSpotlightDemo
                                shot_number={index}
                                prop={shot.distance}
                                speed={shot.speed}
                                player={shot.score}
                              />
                            </BackgroundGradient>
                          ))}

                        <br />
                      </div>
                      <br />
                      <br />
                      <br />
                      <h1 className="text-lg md:text-5xl text-center  font-sans font-bold mb-8 text-white">
                        {"Player 2"}
                      </h1>
                      <div className="flex flex-wrap justify-center gap-7 mt-8">
                        {/* <h1 className="text-lg md:text-xl  font-sans font-bold mb-8 text-red-600">
                    Last 6 shots details
                  </h1> */}

                        <br />
                        {matchData?.scoreArray["Player 2"]
                          ?.slice(-4)
                          .map((shot: any, index: any) => (
                            <BackgroundGradient
                              key={index}
                              className="rounded-[22px]"
                            >
                              <CardSpotlightDemo
                                shot_number={index}
                                prop={shot.distance}
                                speed={shot.speed}
                                player={shot.score}
                              />
                            </BackgroundGradient>
                          ))}

                        <br />
                      </div>
                    </>
                  )}
                </div>
              </>
            )}
          </div>
        </LampDemo>
        <WobbleCardDemo apidata={apidata} />
        <TextToSpeech text={apidata} />
        <Link href={"/actual"} className="m-6 p-4 w-auto max-w-xs">
          <BackgroundGradient key={1} className="rounded-[12px] p-4">
            <h1 className="text-base md:text-lg text-center font-sans font-bold mb-4 text-red-300">
              {"Show actual video"}
            </h1>
          </BackgroundGradient>
        </Link>
      </div>
    </>
  );
}
