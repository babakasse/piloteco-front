import { ReactNode, useEffect, useState } from 'react';

// third-party
import { IntlProvider, MessageFormatElement } from 'react-intl';

// project-imports
import useConfig from 'hooks/useConfig';
import { useLanguage } from 'contexts/LanguageContext';
import { I18n } from 'types/config';

// load locales files
const loadLocaleData = (locale: I18n) => {
  switch (locale) {
    case 'fr':
      return import('utils/locales/fr.json');
    case 'en':
    default:
      return import('utils/locales/en.json');
  }
};

interface Props {
  children: ReactNode;
}

// ==============================|| LOCALIZATION ||============================== //

export default function Locales({ children }: Props) {
  const { i18n } = useConfig();
  const { language } = useLanguage();

  const [messages, setMessages] = useState<Record<string, string> | Record<string, MessageFormatElement[]> | undefined>();

  // Utiliser la langue de notre contexte au lieu de la config
  const currentLocale = language as I18n;

  useEffect(() => {
    loadLocaleData(currentLocale).then((d: { default: Record<string, string> | Record<string, MessageFormatElement[]> | undefined }) => {
      setMessages(d.default);
    });
  }, [currentLocale]);

  return (
    <>
      {messages && (
        <IntlProvider locale={currentLocale} defaultLocale="fr" messages={messages}>
          {children}
        </IntlProvider>
      )}
    </>
  );
}
