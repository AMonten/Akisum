import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import type { ReactNode } from 'react';

interface PlayerPanelProps {
  title: string;
  isActive: boolean;
  children: ReactNode;
}

export function PlayerPanel({ title, isActive, children }: PlayerPanelProps) {
  return (
    <Card className={cn(
      "transition-all duration-300",
      isActive ? 'border-primary shadow-lg shadow-primary/20' : 'border-border/50 bg-card/50'
    )}>
      <CardHeader>
        <CardTitle className={cn(
          "font-headline text-2xl transition-colors",
          isActive ? 'text-primary' : 'text-muted-foreground'
        )}>{title}</CardTitle>
      </CardHeader>
      <CardContent className="min-h-[150px] flex items-center justify-center">
        {children}
      </CardContent>
    </Card>
  );
}
