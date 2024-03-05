import en from './en';
import en_us from './en-us';
import { type I18nType } from './type';
import zh from './zh';
import zh_cn from './zh-cn';

export * from './type';

export default {
  en,
  'en-us': en_us,

  zh,
  'zh-cn': zh_cn
} as I18nType;
