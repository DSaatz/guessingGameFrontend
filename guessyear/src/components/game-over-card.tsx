import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"

interface GameOverCardProps {
  score: number
  onPlayAgain: () => void
}

export function GameOverCard({ score, onPlayAgain }: GameOverCardProps) {
  return (
    <Card className="w-full max-w-md">
      <CardContent className="pt-6 flex flex-col items-center">
        <h2 className="text-2xl font-bold mb-4 text-center">Game over, your score is:</h2>
        <p className="text-6xl font-bold text-primary">{score}</p>
        <Button
          onClick={onPlayAgain}
          className="mt-8"
        >
          Play Again
        </Button>
      </CardContent>
    </Card>
  )
}