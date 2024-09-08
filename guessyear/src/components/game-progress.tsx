interface GameProgressProps {
  currentRound: number
  totalRounds: number
}

export function GameProgress({ currentRound, totalRounds }: GameProgressProps) {
  const progressValue = (currentRound / totalRounds) * 100;

  return (
    <div className="flex items-center space-x-4 w-full">
      <div className="flex-grow">
        {/* Custom progress bar */}
        <div className="relative w-full h-3 bg-gray-200 rounded">
          <div
            className="absolute h-full bg-green-500 rounded"
            style={{ width: `${progressValue}%` }}
          />
        </div>
      </div>
      <span className="text-sm font-medium whitespace-nowrap">
        Round {currentRound} of {totalRounds}
      </span>
    </div>
  );
}
