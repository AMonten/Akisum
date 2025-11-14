import { useI18n } from "@/hooks/use-i18n";

interface ScoreboardProps {
  p1Score: number;
  p2Score: number;
}

export function Scoreboard({ p1Score, p2Score }: ScoreboardProps) {
  const { t } = useI18n();
  return (
    <div className="flex items-center gap-6 rounded-lg bg-card p-3 px-6 shadow-md">
      <div className="text-center">
        <p className="font-headline text-sm text-muted-foreground">{t('playerA')}</p>
        <p className="text-3xl font-bold text-primary">{p1Score}</p>
      </div>
      <div className="text-5xl font-thin text-border">|</div>
       <div className="text-center">
        <p className="font-headline text-sm text-muted-foreground">{t('playerB')}</p>
        <p className="text-3xl font-bold text-accent">{p2Score}</p>
      </div>
    </div>
  );
}
