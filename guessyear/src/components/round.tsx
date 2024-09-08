"use client"

import { useState, useEffect } from 'react'
import { getRandomYear, getAlbumsFromYear, getInventionsFromYear, getEventsFromYear, getMoviesFromYear } from '../lib/utils'
import { Button } from "@/components/ui/button"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { ChevronUp, ChevronDown } from 'lucide-react'

interface RoundProps {
  onGameEnd: (score: number) => void
  onRoundComplete: (roundScore: number) => void
}

const hints = ["album", "invention", "event", "movie"]
const FIRST_POSSIBLE_YEAR = 1948
const LAST_POSSIBLE_YEAR = 2020

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
  const [canRevealHint, setCanRevealHint] = useState<boolean>(true)

  useEffect(() => {
    startNewRound()
  }, [])

  useEffect(() => {
    if (roundsPlayed > 0) {
      onRoundComplete(score)
    }
    if (roundsPlayed >= 5) {
      onGameEnd(score)
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
      return
    }

    const guessNumber = parseInt(guess)
    if (isNaN(guessNumber) || guessNumber < FIRST_POSSIBLE_YEAR || guessNumber > LAST_POSSIBLE_YEAR) {
      setMessage(`Please enter a valid year between ${FIRST_POSSIBLE_YEAR} and ${LAST_POSSIBLE_YEAR}.`)
      return
    }

    const correctYear = year ?? 0
    if (guessNumber === correctYear) {
      const hintsUsed = 4 - guessesLeft
      const pointsEarned = 4 - hintsUsed
      setScore(prevScore => prevScore + pointsEarned)
      setMessage(`Correct! You earned ${pointsEarned} points.`)
      setIsRoundOver(true)
      setTimeout(() => {
        setRoundsPlayed(prev => prev + 1)
        startNewRound()
      }, 2000)
    } else {
      setGuessesLeft(prev => prev - 1)
      if (guessesLeft > 1) {
        setMessage('Incorrect. Try again with another hint.')
        setCanRevealHint(true)
      } else {
        setMessage(`Incorrect. The correct year was <strong class="font-bold">${correctYear}</strong>.`)
        setIsRoundOver(true)
        setTimeout(() => {
          setRoundsPlayed(prev => prev + 1)
          startNewRound()
        }, 2000)
      }
    }
    setGuess('')
  }

  const incrementYear = () => {
    setGuess(prev => {
      const currentYear = parseInt(prev) || FIRST_POSSIBLE_YEAR - 1
      return Math.min(currentYear + 1, LAST_POSSIBLE_YEAR).toString()
    })
  }

  const decrementYear = () => {
    setGuess(prev => {
      const currentYear = parseInt(prev) || FIRST_POSSIBLE_YEAR + 1
      return Math.max(currentYear - 1, FIRST_POSSIBLE_YEAR).toString()
    })
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
                <p className="text-sm min-h-[2.5rem]">{values[hint]}</p>
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
        <div className="relative w-full">
          <Input
            type="text"
            inputMode="numeric"
            value={guess}
            onChange={(e) => setGuess(e.target.value.replace(/\D/g, '').slice(0, 4))}
            placeholder={FIRST_POSSIBLE_YEAR.toString()}
            className="text-2xl py-6 px-4 text-center w-full pr-16"
            disabled={isRoundOver}
          />
          <span className="absolute inset-y-0 left-0 flex items-center pl-4 text-gray-400 pointer-events-none">
            Year:
          </span>
          <div className="absolute inset-y-0 right-0 flex flex-col justify-center mr-2">
            <Button
              type="button"
              variant="ghost"
              size="icon"
              className="h-8 w-8"
              onClick={incrementYear}
              disabled={isRoundOver || parseInt(guess) >= LAST_POSSIBLE_YEAR}
            >
              <ChevronUp className="h-4 w-4" />
            </Button>
            <Button
              type="button"
              variant="ghost"
              size="icon"
              className="h-8 w-8"
              onClick={decrementYear}
              disabled={isRoundOver || parseInt(guess) <= FIRST_POSSIBLE_YEAR}
            >
              <ChevronDown className="h-4 w-4" />
            </Button>
          </div>
        </div>
        <Button 
          onClick={handleGuess} 
          disabled={isRoundOver || guess === ''}
          className="w-full sm:w-auto py-6 text-lg transition-all duration-300 ease-in-out transform hover:scale-105 hover:bg-green-500 hover:text-white"
        >
          Submit Guess
        </Button>
      </div>
      {message && (
        <Alert className="mb-4 w-full max-w-md">
          <AlertTitle>Result</AlertTitle>
          <AlertDescription dangerouslySetInnerHTML={{ __html: message }} />
        </Alert>
      )}
      <p className="text-lg font-semibold">Guesses left: {guessesLeft}</p>
    </div>
  )
}