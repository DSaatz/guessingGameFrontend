import { Progress } from "@/components/ui/progress"

interface GameProgressProps {
  currentRound: number
  totalRounds: number
}

export function GameProgress({ currentRound, totalRounds }: GameProgressProps) {
  return (
    <div className="flex items-center space-x-4 w-full">
      <div className="flex-grow">
        <Progress 
          value={(currentRound / totalRounds) * 100} 
          className="h-3"
        />
      </div>
      <span className="text-sm font-medium whitespace-nowrap">
        Round {currentRound} of {totalRounds}
      </span>
    </div>
  )
}