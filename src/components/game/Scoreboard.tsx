import { User } from "lucide-react";

interface ScoreboardProps {
  p1Score: number;
  p2Score: number;
}

export function Scoreboard({ p1Score, p2Score }: ScoreboardProps) {
  return (
    <div className="flex items-center gap-6 rounded-lg bg-card p-3 px-6 shadow-md">
      <div className="text-center">
        <p className="font-headline text-sm text-muted-foreground">Player A</p>
        <p className="text-3xl font-bold text-primary">{p1Score}</p>
      </div>
      <div className="text-5xl font-thin text-border">|</div>
       <div className="text-center">
        <p className="font-headline text-sm text-muted-foreground">Player B</p>
        <p className="text-3xl font-bold text-accent">{p2Score}</p>
      </div>
    </div>
  );
}
