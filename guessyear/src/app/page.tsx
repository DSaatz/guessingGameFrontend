'use client'

import { useState } from 'react'
import GameDescription from '@/components/gameDescription'
import Round from '@/components/round'
import { GameProgress } from '@/components/game-progress'
import { ScoreDisplay } from '@/components/score-display'
import { Navbar } from '@/components/navbar'
import { Card, CardContent } from "@/components/ui/card"

const TOTAL_ROUNDS = 5

export default function Page() {
  const [gameStarted, setGameStarted] = useState(false)
  const [score, setScore] = useState(0)
  const [currentRound, setCurrentRound] = useState(0)

  const handleGameStart = () => {
    setGameStarted(true)
    setCurrentRound(1)
    setScore(0)
  }

  const handleGameEnd = (finalScore: number) => {
    setScore(finalScore)
    setGameStarted(false)
    setCurrentRound(0)
  }

  const handleRoundComplete = (roundScore: number) => {
    setScore(roundScore)
    setCurrentRound(prevRound => Math.min(prevRound + 1, TOTAL_ROUNDS))
  }

  return (
    <div className="min-h-screen bg-dark-grey text-foreground flex flex-col">
      <Navbar />

      <main className="flex flex-col flex-grow">
        <div className="container mx-auto mt-8 px-4 flex-grow flex flex-col">
          {gameStarted && (
            <Card className="mb-8">
              <CardContent className="pt-6">
                <div className="flex justify-between items-center">
                  <div className="w-3/4">
                    <GameProgress currentRound={currentRound} totalRounds={TOTAL_ROUNDS} />
                  </div>
                  <ScoreDisplay score={score} />
                </div>
              </CardContent>
            </Card>
          )}

          <div className="flex-grow flex flex-col items-center justify-center">
            {!gameStarted ? (
              <GameDescription
                caption="Welcome to the Year Guessing Game"
                description="Guess the correct year based on the hints provided. Each correct guess earns you points. You have 5 rounds to score as high as possible!"
                onRemove={handleGameStart}
              />
            ) : (
              <Round onGameEnd={handleGameEnd} onRoundComplete={handleRoundComplete} />
            )}
          </div>

          {!gameStarted && score > 0 && (
            <Card className="mt-8">
              <CardContent>
                <h2 className="text-2xl font-bold mb-2">Game Over!</h2>
                <p className="text-xl">Your final score is: {score}</p>
              </CardContent>
            </Card>
          )}
        </div>
      </main>
    </div>
  )
}
