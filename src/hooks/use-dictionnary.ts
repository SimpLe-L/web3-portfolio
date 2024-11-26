import { i18n } from "@/i18n-config.ts";
export default function useDict(locale: 'en' | 'zh') {
  if (!i18n.locales.includes(locale)) {
    locale = i18n.defaultLocale;
  }
  const res = require(`@/dictionaries/${locale}.json`);
  return res;
}
