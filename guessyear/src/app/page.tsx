'use client'

import { useState } from 'react'
import GameDescription from '@/components/gameDescription'
import Round from '@/components/round'
import { GameProgress } from '@/components/game-progress'
import { ScoreDisplay } from '@/components/score-display'
import { GameOverCard } from '@/components/game-over-card'
import { Card, CardContent } from "@/components/ui/card"

const TOTAL_ROUNDS = 5

export default function Page() {
  const [gameStarted, setGameStarted] = useState(false)
  const [score, setScore] = useState(0)
  const [currentRound, setCurrentRound] = useState(0)
  const [gameOver, setGameOver] = useState(false)

  const handleGameStart = () => {
    setGameStarted(true)
    setCurrentRound(1)
    setScore(0)
    setGameOver(false)
  }

  const handleGameEnd = (finalScore: number) => {
    setScore(finalScore)
    setGameStarted(false)
    setCurrentRound(0)
    setGameOver(true)
  }

  const handleRoundComplete = (roundScore: number) => {
    setScore(roundScore)
    setCurrentRound(prevRound => Math.min(prevRound + 1, TOTAL_ROUNDS))
  }

  return (
    <div className="flex flex-col min-h-screen bg-background text-foreground">
      <main className="flex-grow flex flex-col">
        <div className="container mx-auto px-4 py-8 flex flex-col flex-grow">
          {gameStarted && !gameOver && (
            <Card className="mb-6">
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

          <div className="flex-grow flex items-center justify-center">
            {!gameStarted && !gameOver ? (
              <GameDescription
                caption="Welcome to the Year Guessing Game"
                description="Guess the correct year based on the hints provided. Each correct guess earns you points. You have 5 rounds to score as high as possible!"
                onRemove={handleGameStart}
              />
            ) : gameOver ? (
              <GameOverCard score={score} onPlayAgain={handleGameStart} />
            ) : (
              <Round onGameEnd={handleGameEnd} onRoundComplete={handleRoundComplete} />
            )}
          </div>
        </div>
      </main>
    </div>
  )
}