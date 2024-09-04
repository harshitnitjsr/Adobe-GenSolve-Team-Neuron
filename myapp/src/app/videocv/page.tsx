"use client";

import Image from "next/image";
import { useState, useEffect,useRef  } from "react";
import axios from "axios";
import Link from "next/link";
import { CardBody, CardContainer, CardItem } from "../../components/ui/3d-card";
import { BackgroundGradient } from "@/components/ui/background-gradient";
import { Spotlight } from "@/components/ui/Spotlight";
import { TypewriterEffectSmoothDemo } from "@/components/Name";
import { LampDemo } from "@/components/MyLamp";
import { CardSpotlight } from "@/components/ui/card-spotlight";
import { CardSpotlightDemo } from "@/components/MySpecialCard";
import { CardSpotlightDemoScore } from "@/components/MyScore";
import {TextToSpeech} from "@/components/Audio"

// import { run } from "@/helpers/gemini";
import { GoogleGenerativeAI } from "@google/generative-ai";
import {WobbleCardDemo} from "@/components/Commentary"

export default function Harshit() {
  const [matchData, setMatchData] = useState<any>(null);
  const [score, setScore] = useState<number | null>(null);
  const [apidata, setApidata] = useState<string | null>(null);
  const [key,setKey]=useState<any>("hello")
  const hasFetchedData = useRef(false); // Track if data has been fetched
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
    setKey(process.env.NEXT_PUBLIC_GEMINI_KEY!)
    // console.log(key)
    const genAI = new GoogleGenerativeAI(process.env.NEXT_PUBLIC_GEMINI_KEY!);
    const model = genAI.getGenerativeModel({
      model: "gemini-1.5-flash",
      systemInstruction: "Generate one line commentary not more than one line. Ensure the commentary is engaging, uses sports jargon, and adds a touch of excitement. Output the generated commentary in JSON format {commentary : data} based on my given inputs . . . and generate different type of commentary every time",
      generationConfig: { responseMimeType: "application/json" }
    });

    const prompt = "player 1 shots with the speed of 32km/hrs with the distance of 12m and score of player is now 3 and player 2 is 4";

    const result = await model.generateContent(prompt);
    const jsonObject = JSON.parse(result.response.text());

    setApidata(jsonObject.commentary);
    console.log(jsonObject.commentary);
  };

  // Run fetchData only if it hasn't been run before
  if (!hasFetchedData.current) {
    fetchData();
    hasFetchedData.current = true;
  }
}, []);

  return (
    <>
      <div className="min-h-screen bg-slate-950 py-12 pt-36">
        <TypewriterEffectSmoothDemo />

        <LampDemo first={"Video with Analysis"}>
          <div className="flex flex-wrap justify-center">
            <div className="min-h-screen bg-slate-950 py-12 pt-36">
              <BackgroundGradient key={1} className="rounded-[22px]">
                <h1 className="text-lg md:text-4xl text-center font-sans font-bold mb-8 text-red-300">
                  {"Status"}
                </h1>
                <h1 className="text-lg md:text-5xl text-center font-sans font-bold mb-8 text-white">
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
            </div>
            {matchData && (
              <>
                <div className="flex flex-wrap justify-center gap-7 mt-8">
                  {matchData?.scoreArray
                    ?.slice(-8)
                    .map((shot: any, index: any) => (
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
        </LampDemo>
        <WobbleCardDemo apidata={apidata}/>
        <TextToSpeech text ={apidata}/>
        <Link href={"/actual"} className="m-6 p-4 w-auto max-w-xs">
          <BackgroundGradient key={1} className="rounded-[12px] p-4">
            <h1 className="text-base md:text-lg text-center font-sans font-bold mb-4 text-red-300">
              {"Show Actual Video"} 
            </h1>
          </BackgroundGradient>
        </Link>

      </div>
    </>
  );
}
