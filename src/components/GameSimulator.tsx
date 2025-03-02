import React, { useState } from "react";
import { Button } from "./ui/button";
import { Label } from "./ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import StrategySelector from "./StrategySelector";
import GameResults from "./GameResults";
import { strategies } from "../lib/strategies";
import { initializeGame, playRound, runGame, GameState, Player } from "../lib/game-logic";
import { getRandomColor } from "../lib/utils";

const DEFAULT_MAX_ROUNDS = 100;
const DEFAULT_PLAYERS = [
  {
    id: 1,
    name: "Player 1",
    strategyName: "Tit for Tat",
    strategy: strategies["Tit for Tat"],
    score: 0,
    moves: [],
    color: "#3b82f6" // Blue
  },
  {
    id: 2,
    name: "Player 2",
    strategyName: "Always Defect",
    strategy: strategies["Always Defect"],
    score: 0,
    moves: [],
    color: "#ef4444" // Red
  }
];

const GameSimulator: React.FC = () => {
  const [players, setPlayers] = useState<Player[]>(DEFAULT_PLAYERS);
  const [maxRounds, setMaxRounds] = useState(DEFAULT_MAX_ROUNDS);
  const [gameState, setGameState] = useState<GameState | null>(null);
  const [isSimulating, setIsSimulating] = useState(false);
  const [speed, setSpeed] = useState<"slow" | "medium" | "fast" | "instant">("medium");

  const addPlayer = () => {
    const newId = Math.max(...players.map(p => p.id), 0) + 1;
    const randomStrategy = Object.keys(strategies)[Math.floor(Math.random() * Object.keys(strategies).length)];
    
    setPlayers([
      ...players,
      {
        id: newId,
        name: `Player ${newId}`,
        strategyName: randomStrategy,
        strategy: strategies[randomStrategy],
        score: 0,
        moves: [],
        color: getRandomColor()
      }
    ]);
  };

  const removePlayer = (playerId: number) => {
    if (players.length <= 2) return; // Minimum 2 players
    setPlayers(players.filter(p => p.id !== playerId));
  };

  const handleStrategyChange = (playerId: number, strategyName: string) => {
    setPlayers(
      players.map(player =>
        player.id === playerId
          ? {
              ...player,
              strategyName,
              strategy: strategies[strategyName]
            }
          : player
      )
    );
  };

  const handlePlayerNameChange = (playerId: number, name: string) => {
    setPlayers(
      players.map(player =>
        player.id === playerId
          ? {
              ...player,
              name
            }
          : player
      )
    );
  };

  const handleMaxRoundsChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseInt(e.target.value);
    if (!isNaN(value) && value > 0) {
      setMaxRounds(value);
    }
  };

  const startSimulation = async () => {
    const newGameState = initializeGame(players, maxRounds);
    setGameState(newGameState);
    setIsSimulating(true);

    if (speed === "instant") {
      setGameState(runGame(newGameState));
      setIsSimulating(false);
      return;
    }

    // Determine delay based on speed
    const delay = 
      speed === "slow" ? 1000 : 
      speed === "medium" ? 500 : 
      200; // fast

    let currentState = { ...newGameState, isRunning: true };
    
    while (currentState.isRunning) {
      // Pause to visualize each round
      await new Promise(resolve => setTimeout(resolve, delay));
      
      currentState = playRound(currentState);
      setGameState({ ...currentState });
    }
    
    setIsSimulating(false);
  };

  const resetSimulation = () => {
    setGameState(null);
  };

  return (
    <div className="space-y-8">
      <Card>
        <CardHeader>
          <CardTitle>Game Configuration</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            <div>
              <Label htmlFor="max-rounds">Number of Rounds</Label>
              <input
                id="max-rounds"
                type="number"
                min="1"
                value={maxRounds}
                onChange={handleMaxRoundsChange}
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                disabled={isSimulating}
              />
            </div>

            <div>
              <div className="flex justify-between items-center mb-2">
                <Label>Players and Strategies</Label>
                <Button onClick={addPlayer} disabled={players.length >= 6 || isSimulating} size="sm">
                  Add Player
                </Button>
              </div>

              <div className="space-y-2">
                {players.map((player) => (
                  <div key={player.id} className="flex items-start gap-2">
                    <div className="flex-1">
                      <StrategySelector
                        playerId={player.id}
                        strategyName={player.strategyName}
                        onStrategyChange={handleStrategyChange}
                        playerName={player.name}
                        onPlayerNameChange={handlePlayerNameChange}
                      />
                    </div>
                    {players.length > 2 && (
                      <Button
                        variant="destructive"
                        size="sm"
                        onClick={() => removePlayer(player.id)}
                        disabled={isSimulating}
                        className="mt-8"
                      >
                        Remove
                      </Button>
                    )}
                  </div>
                ))}
              </div>
            </div>

            <div>
              <Label htmlFor="simulation-speed">Simulation Speed</Label>
              <select
                id="simulation-speed"
                value={speed}
                onChange={(e) => setSpeed(e.target.value as any)}
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                disabled={isSimulating}
              >
                <option value="slow">Slow</option>
                <option value="medium">Medium</option>
                <option value="fast">Fast</option>
                <option value="instant">Instant</option>
              </select>
            </div>

            <div className="flex gap-4">
              <Button
                onClick={startSimulation}
                disabled={isSimulating}
                className="flex-1"
              >
                {gameState ? "Restart Simulation" : "Start Simulation"}
              </Button>
              {gameState && (
                <Button
                  onClick={resetSimulation}
                  variant="outline"
                  disabled={isSimulating}
                >
                  Reset
                </Button>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      {gameState && <GameResults gameState={gameState} />}

      <Card>
        <CardHeader>
          <CardTitle>About Game Theory and Strategies</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <p>
              This simulator allows you to experiment with various strategies in the
              Prisoner's Dilemma, a classic game theory scenario.
            </p>
            
            <h3 className="text-lg font-medium">Strategy Descriptions:</h3>
            
            <ul className="list-disc pl-5 space-y-2">
              <li>
                <span className="font-medium">Always Cooperate:</span> Always chooses to
                cooperate regardless of the opponent's moves.
              </li>
              <li>
                <span className="font-medium">Always Defect:</span> Always chooses to
                defect regardless of the opponent's moves.
              </li>
              <li>
                <span className="font-medium">Tit for Tat:</span> Cooperates on the first
                move, then copies the opponent's previous move.
              </li>
              <li>
                <span className="font-medium">Generous Tit for Tat:</span> Like Tit for
                Tat, but occasionally forgives defections (10% chance).
              </li>
              <li>
                <span className="font-medium">Tit for Two Tats:</span> Only defects after
                the opponent defects twice in a row.
              </li>
              <li>
                <span className="font-medium">Grim Trigger:</span> Cooperates until the
                opponent defects, then always defects afterwards.
              </li>
              <li>
                <span className="font-medium">Pavlov:</span> Starts with cooperation. If
                the opponent cooperates, it repeats its last move. If the opponent defects,
                it changes its strategy.
              </li>
              <li>
                <span className="font-medium">Random:</span> Randomly chooses to cooperate
                or defect with equal probability.
              </li>
            </ul>
            
            <h3 className="text-lg font-medium">Scoring:</h3>
            <ul className="list-disc pl-5 space-y-1">
              <li>Both players cooperate: 3 points each</li>
              <li>Both players defect: 1 point each</li>
              <li>One player cooperates, one defects: 0 points for the cooperator, 5 points for the defector</li>
            </ul>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default GameSimulator; 