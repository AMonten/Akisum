"use client";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Settings, Timer, Repeat, Users } from "lucide-react";
import { Label } from "../ui/label";
import { Slider } from "../ui/slider";
import { RadioGroup, RadioGroupItem } from "../ui/radio-group";
import { useI18n } from "@/hooks/use-i18n";

export function SettingsDialog() {
  const { t } = useI18n();

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="ghost" size="icon">
          <Settings />
          <span className="sr-only">{t('gameSettings')}</span>
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle className="font-headline text-2xl">{t('gameSettings')}</DialogTitle>
          <DialogDescription>
            {t('gameSettingsDescription')}
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-6 py-4">
          <div className="grid gap-3">
            <Label htmlFor="time-limit" className="flex items-center"><Timer className="mr-2 h-4 w-4" />{t('timeLimit')}</Label>
            <div className="flex items-center gap-4">
              <Slider defaultValue={[6]} max={15} step={1} id="time-limit" />
              <span className="text-sm font-mono text-muted-foreground">6s</span>
            </div>
             <p className="text-xs text-muted-foreground">{t('timeLimitDescription')}</p>
          </div>
          <div className="grid gap-3">
            <Label htmlFor="repetitions" className="flex items-center"><Repeat className="mr-2 h-4 w-4" />{t('repetitions')}</Label>
            <div className="flex items-center gap-4">
              <Slider defaultValue={[5]} max={10} step={1} id="repetitions" />
               <span className="text-sm font-mono text-muted-foreground">5</span>
            </div>
            <p className="text-xs text-muted-foreground">{t('repetitionsDescription')}</p>
          </div>
          <div className="grid gap-3">
            <Label className="flex items-center"><Users className="mr-2 h-4 w-4" />{t('gameMode')}</Label>
            <RadioGroup defaultValue="1v1" className="flex gap-4">
                <div>
                    <RadioGroupItem value="1v1" id="1v1" className="peer sr-only" />
                    <Label htmlFor="1v1" className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary">
                        1v1
                    </Label>
                </div>
                <div>
                     <RadioGroupItem value="team" id="team" className="peer sr-only" />
                     <Label htmlFor="team" className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary">
                        Team
                    </Label>
                </div>
            </RadioGroup>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
