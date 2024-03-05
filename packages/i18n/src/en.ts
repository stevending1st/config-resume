export const en = {
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
  work: 'work'
};

export default en;

export type I18nType = Record<keyof typeof en, string>;

export type I18nSubType = Partial<I18nType>;
