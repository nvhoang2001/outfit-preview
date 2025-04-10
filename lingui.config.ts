import { formatter as JSONFormatter } from '@lingui/format-json';
import type { LinguiConfig } from '@lingui/conf';
import { defaultLocale, locales } from './src/constants/locales';

const config: LinguiConfig = {
  locales: locales as unknown as string[],
  sourceLocale: defaultLocale,
  catalogs: [
    {
      path: '<rootDir>/src/assets/locales/{locale}',
      include: ['<rootDir>'],
      exclude: ['**/node_modules/**'],
    },
  ],
  format: JSONFormatter({
    style: 'lingui',
  }),
};

export default config;
