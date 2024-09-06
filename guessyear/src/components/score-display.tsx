interface ScoreDisplayProps {
    score: number
  }
  
  export function ScoreDisplay({ score }: ScoreDisplayProps) {
    return (
      <div className="text-lg font-bold">
        Score: {score}
      </div>
    )
  }