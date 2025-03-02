import React from "react";
import { Label } from "./ui/label";
import { Select } from "./ui/select";
import { strategies } from "../lib/strategies";

interface StrategySelectorProps {
  playerId: number;
  strategyName: string;
  onStrategyChange: (playerId: number, strategyName: string) => void;
  playerName: string;
  onPlayerNameChange: (playerId: number, name: string) => void;
}

const StrategySelector: React.FC<StrategySelectorProps> = ({
  playerId,
  strategyName,
  onStrategyChange,
  playerName,
  onPlayerNameChange,
}) => {
  return (
    <div className="flex flex-col gap-2 mb-4">
      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label htmlFor={`player-${playerId}-name`}>Player Name</Label>
          <input
            id={`player-${playerId}-name`}
            type="text"
            value={playerName}
            onChange={(e) => onPlayerNameChange(playerId, e.target.value)}
            className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
          />
        </div>
        <div>
          <Label htmlFor={`player-${playerId}-strategy`}>Strategy</Label>
          <Select
            id={`player-${playerId}-strategy`}
            value={strategyName}
            onChange={(e) => onStrategyChange(playerId, e.target.value)}
          >
            {Object.keys(strategies).map((strategyKey) => (
              <option key={strategyKey} value={strategyKey}>
                {strategyKey}
              </option>
            ))}
          </Select>
        </div>
      </div>
    </div>
  );
};

export default StrategySelector; 