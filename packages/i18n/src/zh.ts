import { I18nItemType } from './type';
import { createAddressFormatter } from './utils/formatAddressForLocale';

export const zh: I18nItemType = {
  awards: '奖项',
  basics: '基础信息',
  certificates: '证书',
  education: '教育',
  interests: '兴趣',
  languages: '语言',
  projects: '项目',
  publications: '出版',
  references: '评价',
  skills: '技能',
  summary: '简介',
  volunteer: '志愿',
  work: '工作',

  addressFormatter: createAddressFormatter([
    ['countryCode', 'region', 'city', 'address', 'postalCode']
  ])
};

export default zh;
