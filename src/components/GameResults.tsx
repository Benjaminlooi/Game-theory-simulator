import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { GameState } from "../lib/game-logic";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import { Line } from "react-chartjs-2";
import { getChartData } from "../lib/game-logic";

// Register Chart.js components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

interface GameResultsProps {
  gameState: GameState;
}

const GameResults: React.FC<GameResultsProps> = ({ gameState }) => {
  // No results to show if no rounds played
  if (gameState.currentRound === 0) {
    return null;
  }

  const chartData = getChartData(gameState);
  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: "top" as const,
      },
      title: {
        display: true,
        text: "Score Progression",
      },
    },
    scales: {
      y: {
        beginAtZero: true,
      },
    },
  };

  // Sort players by score (descending)
  const sortedPlayers = [...gameState.players].sort((a, b) => b.score - a.score);

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Game Results</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="mb-6">
            <h3 className="text-lg font-medium mb-2">Final Scores</h3>
            <div className="space-y-2">
              {sortedPlayers.map((player) => (
                <div
                  key={player.id}
                  className="flex justify-between items-center p-2 rounded bg-secondary"
                >
                  <div className="flex items-center">
                    <div
                      className="w-4 h-4 rounded-full mr-2"
                      style={{ backgroundColor: player.color }}
                    ></div>
                    <span>
                      {player.name} ({player.strategyName})
                    </span>
                  </div>
                  <span className="font-semibold">{player.score}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="h-80">
            <Line options={options} data={chartData} />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Round History</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="max-h-60 overflow-y-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-secondary sticky top-0">
                <tr>
                  <th
                    scope="col"
                    className="px-3 py-2 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider"
                  >
                    Round
                  </th>
                  {gameState.players.map((player) => (
                    <th
                      key={player.id}
                      scope="col"
                      className="px-3 py-2 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider"
                    >
                      {player.name}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="bg-background divide-y divide-gray-200">
                {gameState.roundHistory.map((round) => (
                  <tr key={round.round}>
                    <td className="px-3 py-2 whitespace-nowrap text-sm">
                      Round {round.round + 1}
                    </td>
                    {gameState.players.map((player) => (
                      <td
                        key={player.id}
                        className="px-3 py-2 whitespace-nowrap text-sm"
                      >
                        <div className="flex items-center space-x-1">
                          <span
                            className={`inline-block capitalize ${
                              round.moves[player.id] === "cooperate"
                                ? "text-green-500"
                                : "text-red-500"
                            }`}
                          >
                            {round.moves[player.id]}
                          </span>
                          <span className="text-xs text-muted-foreground">
                            (+{round.scores[player.id] || 0})
                          </span>
                        </div>
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default GameResults; 