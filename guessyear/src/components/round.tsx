'use client'

import { useState, useEffect } from 'react'
import { getRandomYear, getAlbumsFromYear, getInventionsFromYear, getEventsFromYear, getMoviesFromYear } from '../lib/utils'
import { Button } from "@/components/ui/button"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"

interface RoundProps {
  onGameEnd: (score: number) => void
  onRoundComplete: (roundScore: number) => void
}

const hints = ["album", "invention", "event", "movie"]

export default function Round({ onGameEnd, onRoundComplete }: RoundProps) {
  const [year, setYear] = useState<number | null>(null)
  const [values, setValues] = useState<Record<string, string>>({})
  const [revealed, setRevealed] = useState<{ [key: string]: boolean }>({
    album: false,
    invention: false,
    event: false,
    movie: false
  })
  const [guess, setGuess] = useState<string>('')
  const [score, setScore] = useState<number>(0)
  const [roundsPlayed, setRoundsPlayed] = useState<number>(0)
  const [isRoundOver, setIsRoundOver] = useState<boolean>(false)
  const [guessesLeft, setGuessesLeft] = useState<number>(4)
  const [message, setMessage] = useState<string>('')
  const [alertType, setAlertType] = useState<'success' | 'error' | 'warning'>('warning')
  const [canRevealHint, setCanRevealHint] = useState<boolean>(true)

  useEffect(() => {
    startNewRound()
  }, [])

  useEffect(() => {
    if (roundsPlayed >= 5) {
      onGameEnd(score)
    } else if (roundsPlayed > 0) {
      onRoundComplete(score)
    }
  }, [roundsPlayed, score, onGameEnd, onRoundComplete])

  const startNewRound = async () => {
    if (roundsPlayed >= 5) {
      onGameEnd(score)
      return
    }

    setIsRoundOver(false)
    setRevealed({
      album: false,
      invention: false,
      event: false,
      movie: false
    })
    setGuess('')
    setGuessesLeft(4)
    setMessage('')
    setCanRevealHint(true)

    const randomYear = await getRandomYear()
    setYear(randomYear)

    const fetchedValues = await Promise.all([
      getAlbumsFromYear(randomYear),
      getInventionsFromYear(randomYear),
      getEventsFromYear(randomYear),
      getMoviesFromYear(randomYear)
    ])

    setValues({
      album: fetchedValues[0],
      invention: fetchedValues[1],
      event: fetchedValues[2],
      movie: fetchedValues[3]
    })
  }

  const handleBoxClick = (hint: string) => {
    if (!revealed[hint] && canRevealHint) {
      setRevealed(prev => ({ ...prev, [hint]: true }))
      setCanRevealHint(false)
    }
  }

  const handleGuess = () => {
    if (guessesLeft === 4 && !Object.values(revealed).some(Boolean)) {
      setMessage('You must reveal at least one hint before guessing.')
      setAlertType('warning')
      return
    }

    const correctYear = year ?? 0
    if (guess === String(correctYear)) {
      const hintsUsed = 4 - guessesLeft
      const pointsEarned = 4 - hintsUsed
      setScore(prevScore => prevScore + pointsEarned)
      setMessage(`Correct! You earned ${pointsEarned} points.`)
      setAlertType('success')
      setIsRoundOver(true)
      setTimeout(() => {
        setRoundsPlayed(prev => prev + 1)
        startNewRound()
      }, 2000)
    } else {
      setGuessesLeft(prev => prev - 1)
      if (guessesLeft > 1) {
        setMessage('Incorrect. Try again with another hint.')
        setAlertType('warning')
        setCanRevealHint(true)
      } else {
        setMessage(`Incorrect. The correct year was ${correctYear}.`)
        setAlertType('error')
        setIsRoundOver(true)
        setTimeout(() => {
          setRoundsPlayed(prev => prev + 1)
          startNewRound()
        }, 2000)
      }
    }
    setGuess('')
  }

  return (
    <div className="flex flex-col items-center w-full max-w-4xl mx-auto p-4">
      <h1 className="text-3xl font-bold mb-6">Guess the Year</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 w-full mb-6">
        {hints.map(hint => (
          <Card 
            key={hint} 
            className={`w-full transition-all duration-300 ease-in-out transform hover:scale-105 ${isRoundOver ? 'opacity-50' : ''}`}
          >
            <CardHeader>
              <CardTitle className="text-lg">{hint.charAt(0).toUpperCase() + hint.slice(1)}</CardTitle>
            </CardHeader>
            <CardContent>
              {revealed[hint] ? (
                <p className="text-sm">{values[hint]}</p>
              ) : (
                <Button 
                  onClick={() => handleBoxClick(hint)} 
                  disabled={isRoundOver || !canRevealHint}
                  variant="outline" 
                  className="w-full transition-colors duration-300 ease-in-out hover:bg-primary hover:text-primary-foreground"
                >
                  Reveal {hint}
                </Button>
              )}
            </CardContent>
          </Card>
        ))}
      </div>
      <div className="flex flex-col sm:flex-row gap-4 items-center w-full max-w-md mb-4">
        <Input
          type="number"
          min="1948"
          max="2020"
          value={guess}
          onChange={(e) => setGuess(e.target.value)}
          placeholder="Enter year"
          className="flex-grow"
          disabled={isRoundOver}
        />
        <Button 
          onClick={handleGuess} 
          disabled={isRoundOver || guess === ''}
          className="w-full sm:w-auto transition-all duration-300 ease-in-out transform hover:scale-105 hover:bg-primary-dark"
        >
          Submit Guess
        </Button>
      </div>
      {message && (
        <Alert className={`mb-4 w-full max-w-md ${alertType === 'success' ? 'bg-green-100 text-green-800' : alertType === 'error' ? 'bg-red-100 text-red-800' : 'bg-yellow-100 text-yellow-800'}`}>
          <AlertTitle className="font-bold">{alertType === 'success' ? 'Success!' : alertType === 'error' ? 'Error!' : 'Attention!'}</AlertTitle>
          <AlertDescription>{message}</AlertDescription>
        </Alert>
      )}
      <p className="text-lg font-semibold">Guesses left: {guessesLeft}</p>
    </div>
  )
}
