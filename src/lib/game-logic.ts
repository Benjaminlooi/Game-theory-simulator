import { Move, Strategy } from './strategies';

// Payoff matrix for Prisoner's Dilemma
// Format: [player1 payoff, player2 payoff]
export const PAYOFF_MATRIX = {
  'cooperate': {
    'cooperate': [3, 3], // Both cooperate: both get 3 points
    'defect': [0, 5]     // Player1 cooperates, Player2 defects: 0 and 5 points
  },
  'defect': {
    'cooperate': [5, 0], // Player1 defects, Player2 cooperates: 5 and 0 points
    'defect': [1, 1]     // Both defect: both get 1 point
  }
};

export interface Player {
  id: number;
  name: string;
  strategy: Strategy;
  strategyName: string;
  score: number;
  moves: Move[];
  color: string;
}

export interface GameState {
  players: Player[];
  currentRound: number;
  maxRounds: number;
  roundHistory: RoundResult[];
  isRunning: boolean;
}

export interface RoundResult {
  round: number;
  moves: { [playerId: number]: Move };
  scores: { [playerId: number]: number };
}

// Initialize a new game
export function initializeGame(players: Player[], maxRounds: number): GameState {
  return {
    players: players.map(player => ({
      ...player,
      score: 0,
      moves: []
    })),
    currentRound: 0,
    maxRounds,
    roundHistory: [],
    isRunning: false
  };
}

// Play a single round
export function playRound(gameState: GameState): GameState {
  if (gameState.currentRound >= gameState.maxRounds || !gameState.isRunning) {
    return {
      ...gameState,
      isRunning: false
    };
  }

  const roundResult: RoundResult = {
    round: gameState.currentRound,
    moves: {},
    scores: {}
  };

  // Process moves for all pairs of players
  for (let i = 0; i < gameState.players.length; i++) {
    for (let j = i + 1; j < gameState.players.length; j++) {
      const player1 = gameState.players[i];
      const player2 = gameState.players[j];

      // Get the moves based on strategies
      const player1Move = player1.strategy(player2.moves, gameState.currentRound);
      const player2Move = player2.strategy(player1.moves, gameState.currentRound);

      // Record moves
      roundResult.moves[player1.id] = roundResult.moves[player1.id] || player1Move;
      roundResult.moves[player2.id] = roundResult.moves[player2.id] || player2Move;

      // Calculate scores based on payoff matrix
      const [player1Points, player2Points] = PAYOFF_MATRIX[player1Move][player2Move];

      // Update scores
      roundResult.scores[player1.id] = (roundResult.scores[player1.id] || 0) + player1Points;
      roundResult.scores[player2.id] = (roundResult.scores[player2.id] || 0) + player2Points;
    }
  }

  // Update player states with new scores and moves
  const updatedPlayers = gameState.players.map(player => {
    const move = roundResult.moves[player.id];
    const roundScore = roundResult.scores[player.id] || 0;
    
    return {
      ...player,
      score: player.score + roundScore,
      moves: [...player.moves, move]
    };
  });

  return {
    ...gameState,
    players: updatedPlayers,
    currentRound: gameState.currentRound + 1,
    roundHistory: [...gameState.roundHistory, roundResult],
    isRunning: gameState.currentRound + 1 < gameState.maxRounds
  };
}

// Run the entire game
export function runGame(gameState: GameState): GameState {
  let currentState = { ...gameState, isRunning: true };
  
  while (currentState.isRunning) {
    currentState = playRound(currentState);
  }
  
  return currentState;
}

// Get current scores for all players
export function getScores(gameState: GameState): { [playerId: number]: number } {
  return gameState.players.reduce((scores, player) => {
    scores[player.id] = player.score;
    return scores;
  }, {} as { [playerId: number]: number });
}

// Get historical score data formatted for Chart.js
export function getChartData(gameState: GameState) {
  // Generate labels for rounds (starting from 1)
  const labels = Array.from({ length: gameState.currentRound }, (_, i) => i + 1);
  
  // Calculate cumulative scores per round for each player
  const datasets = gameState.players.map(player => {
    const cumulativeScores = [];
    let cumulativeScore = 0;
    
    for (let i = 0; i < gameState.roundHistory.length; i++) {
      const roundScore = gameState.roundHistory[i].scores[player.id] || 0;
      cumulativeScore += roundScore;
      cumulativeScores.push(cumulativeScore);
    }
    
    return {
      label: player.name,
      data: cumulativeScores,
      borderColor: player.color,
      backgroundColor: `${player.color}33`, // Adding transparency
      tension: 0.2,
    };
  });
  
  return {
    labels,
    datasets,
  };
} 