import { I18nProvider as LinguiI18nProvider } from '@lingui/react';
import { i18n } from '@lingui/core';
import { useEffect } from 'react';
import useSettingStore from '@/store/setting.slice';
import { messages as enTrans } from '@/assets/locales/en';
import { messages as viTrans } from '@/assets/locales/vi';
import { defaultLocale } from '@/constants/locales';

interface I18nProviderProps {
  children: React.ReactNode;
}

i18n.loadAndActivate({
  locale: defaultLocale,
  messages: enTrans,
});

function I18nProvider({ children }: I18nProviderProps) {
  const locale = useSettingStore(state => state.localeLang);

  useEffect(() => {
    const localeCode = locale.slice(0, 2);

    if (locale !== i18n.locale) {
      const localesTrans = new Map<string, any>();

      localesTrans.set('en', enTrans);
      localesTrans.set('vi', viTrans);

      try {
        const message = localesTrans.get(localeCode);
        i18n.loadAndActivate({ locale: localeCode, messages: message });
      } catch (error) {}
    }
  }, []);

  return <LinguiI18nProvider i18n={i18n}>{children}</LinguiI18nProvider>;
}

I18nProvider.displayName = 'AppLocalizationProvider';

export default I18nProvider;
