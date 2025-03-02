# Game Theory Simulator

A web-based simulator for the Prisoner's Dilemma game theory scenario, built with React, Vite, TailwindCSS, and Chart.js.

## Features

- Simulate the Prisoner's Dilemma with multiple players
- Choose from various well-known strategies:
  - Tit for Tat
  - Always Cooperate
  - Always Defect
  - Generous Tit for Tat
  - Tit for Two Tats
  - Grim Trigger
  - Pavlov (Win-Stay, Lose-Shift)
  - Random
- Visualize results with real-time charts
- Adjust simulation speed and number of rounds
- Add or remove players (up to 6)

## Getting Started

### Prerequisites

- Node.js (v14 or higher)
- npm or yarn

### Installation

1. Clone the repository
```bash
git clone https://github.com/yourusername/game-theory-simulator.git
cd game-theory-simulator
```

2. Install dependencies
```bash
npm install
```

3. Start the development server
```bash
npm run dev
```

4. Open your browser and navigate to `http://localhost:5173`

## How It Works

The simulator implements the classic Prisoner's Dilemma from game theory:

- Each player can choose to either cooperate or defect in each round
- The payoff depends on the combination of choices:
  - Both cooperate: 3 points each
  - Both defect: 1 point each
  - One cooperates, one defects: 0 points for cooperator, 5 points for defector

Players use strategies to determine their moves based on the history of the game.

## Technologies Used

- [React](https://reactjs.org/)
- [TypeScript](https://www.typescriptlang.org/)
- [Vite](https://vitejs.dev/)
- [TailwindCSS](https://tailwindcss.com/)
- [Chart.js](https://www.chartjs.org/) with [react-chartjs-2](https://react-chartjs-2.js.org/)

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Acknowledgments

- [The Evolution of Trust](https://ncase.me/trust/) by Nicky Case - a great interactive explanation of game theory
- Robert Axelrod's work on the evolution of cooperation
