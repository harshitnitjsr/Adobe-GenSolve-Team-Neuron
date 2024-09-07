import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import { FC } from 'react';

// Register Chart.js modules
ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

// Define the types for the match data
interface ScoreEvent {
  score: number;
  distance: number;
  speed: number;
}

interface MatchData {
  finalScore: number[];
  scoreArray: {
    'Player 1': ScoreEvent[];
    'Player 2': ScoreEvent[];
  };
  liveScore: {
    'Player 1': number;
    'Player 2': number;
  };
  Status: string;
  HitPlayer: string;
}

// Define the props type for the ScoreGraph component
interface ScoreGraphProps {
  matchData: MatchData;
}

export const ScoreComparisonGraph: FC<ScoreGraphProps> = ({ matchData }) => {
  const player1Data = matchData.scoreArray['Player 1'];
  const player2Data = matchData.scoreArray['Player 2'];

  const indices = player1Data.map((_, index) => index + 1); // Create index labels (1, 2, 3, ...)

  const player1Distances = player1Data.map(event => event.distance);
  const player1Scores = player1Data.map(event => event.score);
  const player1Speeds = player1Data.map(event => event.speed);

  const player2Distances = player2Data.map(event => event.distance);
  const player2Scores = player2Data.map(event => event.score);
  const player2Speeds = player2Data.map(event => event.speed);

  // Data for Distance Comparison
  const distanceData = {
    labels: indices, // X-axis will show array index (1, 2, 3, ...)
    datasets: [
      {
        label: 'Player 1 Distance (m)',
        data: player1Distances,
        borderColor: 'blue',
        borderWidth: 2,
        fill: false,
      },
      {
        label: 'Player 2 Distance (m)',
        data: player2Distances,
        borderColor: 'red',
        borderWidth: 2,
        fill: false,
      },
    ],
  };

  // Data for Score Comparison
  const scoreData = {
    labels: indices, // X-axis will show array index
    datasets: [
      {
        label: 'Player 1 Score',
        data: player1Scores,
        borderColor: 'blue',
        borderWidth: 2,
        fill: false,
      },
      {
        label: 'Player 2 Score',
        data: player2Scores,
        borderColor: 'red',
        borderWidth: 2,
        fill: false,
      },
    ],
  };

  // Data for Speed Comparison
  const speedData = {
    labels: indices, // X-axis will show array index
    datasets: [
      {
        label: 'Player 1 Speed (km/h)',
        data: player1Speeds,
        borderColor: 'blue',
        borderWidth: 2,
        borderDash: [5, 5],
        fill: false,
      },
      {
        label: 'Player 2 Speed (km/h)',
        data: player2Speeds,
        borderColor: 'red',
        borderWidth: 2,
        borderDash: [5, 5],
        fill: false,
      },
    ],
  };

  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top' as const,
      },
      title: {
        display: true,
      },
    },
    scales: {
      x: {
        title: {
          display: true,
          text: 'Event Index',
        },
      },
      y: {
        title: {
          display: true,
        },
      },
    },
  };

  return (
    <div className="space-y-6">
      {/* Distance Comparison Graph */}
      {/* <div className="bg-white p-4 rounded-lg shadow-md">
        <h2 className="text-xl font-semibold mb-4">Distance Comparison</h2>
        <Line
          data={distanceData}
          options={{
            ...options,
            plugins: { ...options.plugins, title: { display: true, text: 'Distance Comparison' } },
            scales: { ...options.scales, y: { title: { display: true, text: 'Distance (m)' } } },
          }}
        />
      </div> */}

      {/* Score Comparison Graph */}
      <div className="bg-white p-4 rounded-lg shadow-md">
        <h2 className="text-xl font-semibold mb-4">Score Comparison</h2>
        <Line
          data={scoreData}
          options={{
            ...options,
            plugins: { ...options.plugins, title: { display: true, text: 'Score Comparison' } },
            scales: { ...options.scales, y: { title: { display: true, text: 'Score' } } },
          }}
        />
      </div>

      {/* Speed Comparison Graph */}
      {/* <div className="bg-white p-4 rounded-lg shadow-md">
        <h2 className="text-xl font-semibold mb-4">Speed Comparison</h2>
        <Line
          data={speedData}
          options={{
            ...options,
            plugins: { ...options.plugins, title: { display: true, text: 'Speed Comparison' } },
            scales: { ...options.scales, y: { title: { display: true, text: 'Speed (km/h)' } } },
          }}
        />
      </div> */}
    </div>
  );
};
