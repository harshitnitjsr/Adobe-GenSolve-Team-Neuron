"use client";
import { ScoreGraph } from "../../components/ScoreGraph";
import { AnimatedModalDemo } from "../../components/Modal";
import { SpeedScoreGraph } from "../../components/SpeedScoreGraph";
import { ScoreComparisonGraph } from "../../components/ScoreComparisonGraph";
import { useEffect, useState } from "react";
import axios from "axios";
export default function ScoreAnalytics() {
  const [matchData, setMatchData] = useState<any>(null);
  useEffect(() => {
    const fetchMatchData = async () => {
      try {
        const response = await axios.get(
          "http://localhost:5000/get_match_data"
        );
        // console.log(response);
        setMatchData(response.data);
      } catch (error) {
        console.error("Error fetching the match data:", error);
      }
    };
    fetchMatchData();

    const interval = setInterval(() => {
      fetchMatchData();
    }, 5000);

    return () => clearInterval(interval);
  }, []);
  return (
    <div className="p-6 bg-slate-950 min-h-screen mt">
      <div style={{ marginTop: "132px" }}>
        <h1 className="text-3xl font-bold text-center bg-slate-950 mb-6">
          Badminton Match Analysis
        </h1>
      </div>
      <div className=" p-4 rounded-lg shadow-md flex  justify-between mt-11">
        <AnimatedModalDemo heading={"Distance"}>
          <ScoreGraph matchData={matchData} />
        </AnimatedModalDemo>
        <AnimatedModalDemo heading={"Speed"}>
          <SpeedScoreGraph matchData={matchData} />
        </AnimatedModalDemo>
        <AnimatedModalDemo heading={"Score"}>
          <ScoreComparisonGraph matchData={matchData} />
        </AnimatedModalDemo>
      </div>
    </div>
  );
}
