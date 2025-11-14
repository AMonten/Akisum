"use client";

import { Button } from "@/components/ui/button";
import { useI18n } from "@/hooks/use-i18n";
import { Languages } from "lucide-react";

export function LanguageToggle() {
  const { language, setLanguage } = useI18n();

  const toggleLanguage = () => {
    setLanguage(language === "en" ? "es" : "en");
  };

  return (
    <Button variant="ghost" size="icon" onClick={toggleLanguage}>
      <Languages className="h-6 w-6" />
      <span className="sr-only">Toggle Language</span>
    </Button>
  );
}
