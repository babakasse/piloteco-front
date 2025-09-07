import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { translations, SupportedLanguages, TranslationKeys } from '../locales';

interface LanguageContextType {
  language: SupportedLanguages;
  setLanguage: (language: SupportedLanguages) => void;
  t: (key: TranslationKeys, params?: Record<string, string | number>) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

interface LanguageProviderProps {
  children: ReactNode;
}

export const LanguageProvider: React.FC<LanguageProviderProps> = ({ children }) => {
  // Récupérer la langue depuis le localStorage ou utiliser 'fr' par défaut
  const [language, setLanguage] = useState<SupportedLanguages>(() => {
    const savedLanguage = localStorage.getItem('piloteco-language');
    return (savedLanguage as SupportedLanguages) || 'fr';
  });

  // Sauvegarder la langue dans le localStorage quand elle change
  useEffect(() => {
    localStorage.setItem('piloteco-language', language);
  }, [language]);

  // Fonction de traduction
  const t = (key: TranslationKeys, params?: Record<string, string | number>): string => {
    const langTranslations = translations[language] as Record<string, string>;
    const frTranslations = translations['fr'] as Record<string, string>;
    let translation = langTranslations[key as string] || frTranslations[key as string] || key;

    // Remplacer les paramètres dans la traduction
    if (params) {
      Object.entries(params).forEach(([paramKey, paramValue]) => {
        translation = translation.replace(`{${paramKey}}`, String(paramValue));
      });
    }

    return translation;
  };

  const value = {
    language,
    setLanguage,
    t
  };

  return <LanguageContext.Provider value={value}>{children}</LanguageContext.Provider>;
};

export const useLanguage = (): LanguageContextType => {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};

export default LanguageContext;
