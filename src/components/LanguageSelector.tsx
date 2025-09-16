import { useState } from 'react'
import { Globe, Check } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { useLanguage } from '@/contexts/LanguageContext'
import { getTranslation } from '@/lib/translations'

const languages = [
  { code: 'en' as const, name: 'English', nativeName: 'English' },
  { code: 'hi' as const, name: 'Hindi', nativeName: 'हिंदी' },
  { code: 'pa' as const, name: 'Punjabi', nativeName: 'ਪੰਜਾਬੀ' },
  { code: 'kn' as const, name: 'Kannada', nativeName: 'ಕನ್ನಡ' },
]

interface LanguageSelectorProps {
  asMenuItem?: boolean
  currentLanguageDisplay?: string
}

export function LanguageSelector({ asMenuItem = false, currentLanguageDisplay }: LanguageSelectorProps) {
  const { language, setLanguage } = useLanguage()
  const [open, setOpen] = useState(false)

  const currentLanguage = languages.find(lang => lang.code === language)

  if (asMenuItem) {
    return (
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger asChild>
          <div className="flex items-center justify-between w-full cursor-pointer">
            <div className="flex items-center space-x-3">
              <Globe className="h-5 w-5 text-primary" />
              <div>
                <p className="font-medium text-sm">{getTranslation(language, 'language')}</p>
                <p className="text-xs text-muted-foreground">
                  {currentLanguageDisplay || currentLanguage?.nativeName}
                </p>
              </div>
            </div>
            <Button variant="ghost" size="sm" className="text-muted-foreground">
              →
            </Button>
          </div>
        </DialogTrigger>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>{getTranslation(language, 'selectLanguage')}</DialogTitle>
          </DialogHeader>
          <div className="grid gap-2 py-4">
            {languages.map((lang) => (
              <Button
                key={lang.code}
                variant={language === lang.code ? "default" : "ghost"}
                className="justify-between h-auto py-3"
                onClick={() => {
                  setLanguage(lang.code)
                  setOpen(false)
                }}
              >
                <div className="text-left">
                  <div className="font-medium">{lang.name}</div>
                  <div className="text-sm text-muted-foreground">{lang.nativeName}</div>
                </div>
                {language === lang.code && <Check className="h-4 w-4" />}
              </Button>
            ))}
          </div>
        </DialogContent>
      </Dialog>
    )
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm" className="space-x-2">
          <Globe className="h-4 w-4" />
          <span>{currentLanguage?.nativeName}</span>
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>{getTranslation(language, 'selectLanguage')}</DialogTitle>
        </DialogHeader>
        <div className="grid gap-2 py-4">
          {languages.map((lang) => (
            <Button
              key={lang.code}
              variant={language === lang.code ? "default" : "ghost"}
              className="justify-between h-auto py-3"
              onClick={() => {
                setLanguage(lang.code)
                setOpen(false)
              }}
            >
              <div className="text-left">
                <div className="font-medium">{lang.name}</div>
                <div className="text-sm text-muted-foreground">{lang.nativeName}</div>
              </div>
              {language === lang.code && <Check className="h-4 w-4" />}
            </Button>
          ))}
        </div>
      </DialogContent>
    </Dialog>
  )
}