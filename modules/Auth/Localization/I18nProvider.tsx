import { I18nProvider as LinguiI18nProvider } from "@lingui/react";
import { i18n } from "@lingui/core";
import { useEffect } from "react";
import useSettingStore from "@/store/setting.slice";

interface I18nProviderProps {
	children: React.ReactNode;
}

i18n.load("en", require("@/assets/locales/en.js"));
i18n.activate("en");

function I18nProvider({ children }: I18nProviderProps) {
	const locale = useSettingStore((state) => state.localeLang);

	useEffect(() => {
		const localeCode = locale.slice(0, 2);

		if (locale !== i18n.locale) {
			const localesTrans = new Map<string, any>();

			localesTrans.set("en", require("@/assets/locales/en.js"));
			localesTrans.set("vi", require("@/assets/locales/vi.js"));

			try {
				const message = localesTrans.get(localeCode);
				i18n.load(localeCode, message.messages);
				i18n.activate(localeCode);
			} catch (error) {}
		}
	}, []);

	return <LinguiI18nProvider i18n={i18n}>{children}</LinguiI18nProvider>;
}

export default I18nProvider;
