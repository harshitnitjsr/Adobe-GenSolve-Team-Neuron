'use client'
import { ScoreGraph } from '../../components/ScoreGraph';
import { AnimatedModalDemo } from '../../components/Modal';
import { SpeedScoreGraph } from "../../components/SpeedScoreGraph"
import {ScoreComparisonGraph} from "../../components/ScoreComparisonGraph"
export default function ScoreAnalytics() {
  const matchData = {
    finalScore: [21, 18],
    scoreArray: {
      'Player 1': [
        { score: 11, distance: 8.2, speed: 60 },
        { score: 13, distance: 6.5, speed: 58 },
        { score: 15, distance: 7.5, speed: 65 },
      ],
      'Player 2': [
        { score: 10, distance: 9.0, speed: 62 },
        { score: 12, distance: 7.8, speed: 63 },
        { score: 15, distance: 7.5, speed: 65 },
      ],
    },
    liveScore: { 'Player 1': 10, 'Player 2': 7 },
    Status: '',
    HitPlayer: '',
  };

  return ( 
    <div className="p-6 bg-slate-950 min-h-screen mt">
     <div  style={{marginTop:"132px"}}>
     <h1 className="text-3xl font-bold text-center bg-slate-950 mb-6">Badminton Match Analysis</h1>
        </div> 
      <div className=" p-4 rounded-lg shadow-md flex  justify-between mt-11">
      
        <AnimatedModalDemo heading={"Distance"}>
          <ScoreGraph matchData={matchData}  />
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
