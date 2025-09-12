import { I18nItemType } from './type';
import { createAddressFormatter } from './utils/formatAddressForLocale';

export const en: I18nItemType = {
  awards: 'awards',
  basics: 'basics',
  certificates: 'certificates',
  education: 'education',
  interests: 'interests',
  languages: 'languages',
  projects: 'projects',
  publications: 'publications',
  references: 'references',
  skills: 'skills',
  summary: 'summary',
  volunteer: 'volunteer',
  work: 'work',

  addressFormatter: createAddressFormatter([
    ['address'],
    ['city', 'region', 'postalCode'],
    ['countryCode']
  ])
};

export default en;
