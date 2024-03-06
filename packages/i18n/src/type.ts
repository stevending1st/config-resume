export type I18nItemType = Record<
  | 'awards'
  | 'basics'
  | 'certificates'
  | 'education'
  | 'interests'
  | 'languages'
  | 'projects'
  | 'publications'
  | 'references'
  | 'skills'
  | 'summary'
  | 'volunteer'
  | 'work',
  string
>;

export type I18nItemSubType = Partial<I18nItemType>;

export type I18nItemExpansionType = I18nItemType & Record<string, string>;

export type I18nType = Record<string, I18nItemExpansionType>;
