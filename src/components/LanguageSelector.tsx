import { useLanguage } from "@/contexts/LanguageContext";
import { Language } from "@/lib/translations";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Check, Globe, X } from "lucide-react";
import { useState } from "react";

interface LanguageSelectorProps {
  asMenuItem?: boolean;
  currentLanguageDisplay?: string;
}

export function LanguageSelector({ asMenuItem = false, currentLanguageDisplay }: LanguageSelectorProps) {
  const { language, setLanguage, completeSelection, t } = useLanguage();
  const [isOpen, setIsOpen] = useState(!asMenuItem);

  const languages: { code: Language; name: string; nativeName: string }[] = [
    { code: "en", name: "English", nativeName: "English" },
    { code: "hi", name: "Hindi", nativeName: "हिन्दी" },
    { code: "ch", name: "Chhattisgarhi", nativeName: "छत्तीसगढ़ी" },
  ];

  const handleContinue = () => {
    completeSelection();
    if (asMenuItem) {
      setIsOpen(false);
    }
  };

  const handleCreateSelection = (code: Language) => {
    setLanguage(code);
    if (asMenuItem) {
      // Optional: auto-close or let them click continue? 
      // Let's keep consistency and require clicking continue or just close.
      // But for better UX in settings, immediate switch is often preferred, but let's stick to the UI.
    }
  }

  // If used as a menu item, render the trigger row
  if (asMenuItem && !isOpen) {
    return (
      <div
        className="flex items-center justify-between"
        onClick={() => setIsOpen(true)}
      >
        <div className="flex items-center space-x-3">
          <Globe className="h-5 w-5 text-primary" />
          <div>
            <p className="font-medium text-sm">{t("language")}</p>
            <p className="text-xs text-muted-foreground">{currentLanguageDisplay}</p>
          </div>
        </div>
        <Button variant="ghost" size="sm" className="text-muted-foreground">
          →
        </Button>
      </div>
    );
  }

  // Render the Modal (either because it's welcome screen or opened from menu)
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-background/95 backdrop-blur-sm p-4 animate-in fade-in duration-300">
      <Card className="w-full max-w-md p-6 space-y-6 shadow-float border-primary/20 bg-card relative">
        {asMenuItem && (
          <Button
            variant="ghost"
            size="icon"
            className="absolute right-2 top-2"
            onClick={() => setIsOpen(false)}
          >
            <X className="h-4 w-4" />
          </Button>
        )}

        <div className="text-center space-y-2">
          {!asMenuItem && <h1 className="text-2xl font-bold text-foreground">Welcome to NavGati</h1>}
          <p className="text-muted-foreground">{asMenuItem ? t("language") : t("welcome.select_language")}</p>
        </div>

        <div className="space-y-3">
          {languages.map((lang) => (
            <div
              key={lang.code}
              onClick={() => handleCreateSelection(lang.code)}
              className={`
                relative flex items-center p-4 rounded-xl cursor-pointer border-2 transition-all duration-200
                ${language === lang.code
                  ? "border-primary bg-primary/5 shadow-md"
                  : "border-transparent bg-secondary/50 hover:bg-secondary"
                }
              `}
            >
              <div className="flex-1">
                <p className="font-semibold text-lg">{lang.nativeName}</p>
                <p className="text-sm text-muted-foreground">{lang.name}</p>
              </div>
              {language === lang.code && (
                <div className="h-6 w-6 bg-primary rounded-full flex items-center justify-center text-primary-foreground animate-in zoom-in duration-200">
                  <Check className="h-4 w-4" />
                </div>
              )}
            </div>
          ))}
        </div>

        <Button
          onClick={handleContinue}
          className="w-full h-12 text-lg font-medium shadow-lg hover:shadow-xl transition-all"
        >
          {asMenuItem ? t("save") : t("welcome.continue")}
        </Button>
      </Card>
    </div>
  );
}