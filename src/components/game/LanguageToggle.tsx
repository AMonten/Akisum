"use client";

import { Button } from "@/components/ui/button";
import { useI18n } from "@/hooks/use-i18n";
import { SpainFlag } from "../icons/SpainFlag";
import { UsaFlag } from "../icons/UsaFlag";

export function LanguageToggle() {
  const { language, setLanguage } = useI18n();

  const toggleLanguage = () => {
    setLanguage(language === "en" ? "es" : "en");
  };

  return (
    <Button variant="ghost" size="icon" onClick={toggleLanguage} className="w-10 h-10">
      {language === 'en' ? (
        <SpainFlag className="h-6 w-8 rounded-sm" />
      ) : (
        <UsaFlag className="h-6 w-8 rounded-sm" />
      )}
      <span className="sr-only">Toggle Language</span>
    </Button>
  );
}
