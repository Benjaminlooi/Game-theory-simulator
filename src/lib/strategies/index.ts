export type Move = 'cooperate' | 'defect';
export type Strategy = (previousOpponentMoves: Move[], currentRound: number) => Move;

// Always cooperate strategy
export const alwaysCooperate: Strategy = () => 'cooperate';

// Always defect strategy
export const alwaysDefect: Strategy = () => 'defect';

// Tit for Tat - cooperate on first move, then copy opponent's last move
export const titForTat: Strategy = (previousOpponentMoves, currentRound) => {
  // First move, cooperate
  if (currentRound === 0 || previousOpponentMoves.length === 0) {
    return 'cooperate';
  }
  
  // For subsequent moves, copy opponent's last move
  return previousOpponentMoves[previousOpponentMoves.length - 1];
};

// Generous Tit for Tat - like Tit for Tat but occasionally forgives
export const generousTitForTat: Strategy = (previousOpponentMoves, currentRound) => {
  // First move, cooperate
  if (currentRound === 0 || previousOpponentMoves.length === 0) {
    return 'cooperate';
  }
  
  // 10% chance to cooperate even if opponent defected
  if (previousOpponentMoves[previousOpponentMoves.length - 1] === 'defect' && Math.random() < 0.1) {
    return 'cooperate';
  }
  
  // Otherwise, copy opponent's last move
  return previousOpponentMoves[previousOpponentMoves.length - 1];
};

// Tit for Two Tats - only defect after opponent defects twice in a row
export const titForTwoTats: Strategy = (previousOpponentMoves, currentRound) => {
  // First move, cooperate
  if (currentRound <= 1 || previousOpponentMoves.length <= 1) {
    return 'cooperate';
  }
  
  // Check the last two moves
  const lastMove = previousOpponentMoves[previousOpponentMoves.length - 1];
  const secondLastMove = previousOpponentMoves[previousOpponentMoves.length - 2];
  
  // Defect only if opponent defected twice in a row
  if (lastMove === 'defect' && secondLastMove === 'defect') {
    return 'defect';
  }
  
  return 'cooperate';
};

// Grim Trigger - cooperate until opponent defects, then always defect
export const grimTrigger: Strategy = (previousOpponentMoves, currentRound) => {
  // First move, cooperate
  if (currentRound === 0 || previousOpponentMoves.length === 0) {
    return 'cooperate';
  }
  
  // Check if opponent ever defected
  if (previousOpponentMoves.includes('defect')) {
    return 'defect';
  }
  
  return 'cooperate';
};

// Pavlov (Win-Stay, Lose-Shift) - cooperate initially, then change strategy if previous outcome was bad
export const pavlov: Strategy = (previousOpponentMoves, currentRound) => {
  // First move, cooperate
  if (currentRound === 0 || previousOpponentMoves.length === 0) {
    return 'cooperate';
  }
  
  // Get our last move and opponent's last move
  const opponentLastMove = previousOpponentMoves[previousOpponentMoves.length - 1];
  
  // If we got a good outcome (CC or DC), repeat last move, otherwise change
  if (opponentLastMove === 'cooperate') {
    return 'cooperate'; // If opponent cooperated last time, cooperate
  } else {
    return 'defect'; // If opponent defected last time, defect
  }
};

// Random strategy - randomly choose to cooperate or defect
export const random: Strategy = () => {
  return Math.random() < 0.5 ? 'cooperate' : 'defect';
};

// Strategies available in the simulator
export const strategies = {
  'Always Cooperate': alwaysCooperate,
  'Always Defect': alwaysDefect,
  'Tit for Tat': titForTat,
  'Generous Tit for Tat': generousTitForTat,
  'Tit for Two Tats': titForTwoTats,
  'Grim Trigger': grimTrigger,
  'Pavlov': pavlov,
  'Random': random
}; 