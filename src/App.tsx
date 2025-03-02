import GameSimulator from './components/GameSimulator'

function App() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <div className="container mx-auto py-8 px-4">
        <header className="mb-8 text-center">
          <h1 className="text-4xl font-bold mb-2">Game Theory Simulator</h1>
          <p className="text-muted-foreground">
            Experiment with different strategies in the Prisoner's Dilemma
          </p>
        </header>
        
        <main>
          <GameSimulator />
        </main>
        
        <footer className="mt-12 text-center text-sm text-muted-foreground">
          <p>
            Built with React, Vite, TailwindCSS, and Chart.js
          </p>
        </footer>
      </div>
    </div>
  )
}

export default App
