import en from './en';
import en_us from './en-us';
import { type I18nType } from './type';
import zh from './zh';
import zh_cn from './zh-cn';

export * from './supportedLanguage';
export * from './type';
export * from './utils/formatAddressForLocale';

export default {
  en,
  'en-us': en_us,

  zh,
  'zh-cn': zh_cn
} as unknown as I18nType;
