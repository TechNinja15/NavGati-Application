import { createContext, useContext, useEffect, useState } from 'react';
import { translations } from '@/lib/translations';
const initialState = {
    language: 'en',
    setLanguage: () => null,
    t: (key) => key,
    hasSelectedLanguage: true,
    completeSelection: () => null,
    resetSelection: () => null,
};
const LanguageProviderContext = createContext(initialState);
export function LanguageProvider({ children, defaultLanguage = 'en', storageKey = 'bus-app-language', ...props }) {
    // Check if user has explicitly selected a language before
    const [hasSelectedLanguage, setHasSelectedLanguage] = useState(() => {
        return !!localStorage.getItem(storageKey + '-selected');
    });
    // Ensure default language is valid, default to 'en' if not
    const [language, setLanguage] = useState(() => {
        const storedLang = localStorage.getItem(storageKey);
        return (storedLang && translations[storedLang]) ? storedLang : defaultLanguage;
    });
    useEffect(() => {
        localStorage.setItem(storageKey, language);
        document.documentElement.lang = language;
    }, [language, storageKey]);
    const completeSelection = () => {
        setHasSelectedLanguage(true);
        localStorage.setItem(storageKey + '-selected', 'true');
    };
    const resetSelection = () => {
        setHasSelectedLanguage(false);
        localStorage.removeItem(storageKey + '-selected');
        // We don't remove the language itself, just the "selected" flag so the prompt appears
    };
    const t = (key) => {
        // Nested object support not strictly needed with flat structure, but safe to keep basic lookup
        // Currently we flat keys like "routes.title"
        return translations[language][key] || translations['en'][key] || key;
    };
    const value = {
        language,
        setLanguage,
        t,
        hasSelectedLanguage,
        completeSelection,
        resetSelection
    };
    return (<LanguageProviderContext.Provider {...props} value={value}>
      {children}
    </LanguageProviderContext.Provider>);
}
export const useLanguage = () => {
    const context = useContext(LanguageProviderContext);
    if (context === undefined)
        throw new Error('useLanguage must be used within a LanguageProvider');
    return context;
};
