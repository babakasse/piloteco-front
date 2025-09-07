import fr from './fr';
import en from './en';

export const translations = {
  fr,
  en
};

export type SupportedLanguages = 'fr' | 'en';
export type TranslationKeys = keyof typeof fr | keyof typeof en;

export default translations;
