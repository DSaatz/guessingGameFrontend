import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "@/components/ui/card"
import { Button } from "@/components/ui/button"

interface GameDescriptionProps {
  caption: string
  description: string
  onRemove: () => void
}

export default function GameDescription({ caption, description, onRemove }: GameDescriptionProps) {
  return (
    <div className="flex items-center justify-center min-h-[calc(100vh-4rem)]">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>{caption}</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">{description}</p>
        </CardContent>
        <CardFooter>
          <Button variant="destructive" onClick={onRemove} className="w-full">
            Understood
          </Button>
        </CardFooter>
      </Card>
    </div>
  )
}