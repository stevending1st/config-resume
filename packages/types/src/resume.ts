export type Highlights = Record<'highlights', string[]>;

export type Keywords = Record<'keywords', string[]>;

export type LocationKey =
  | 'address'
  | 'postalCode'
  | 'city'
  | 'countryCode'
  | 'region';
export type Location = Partial<Record<LocationKey, string>>;

export type Profile = Partial<Record<'network' | 'username' | 'url', string>>;

export type Basics = Partial<
  Record<
    'name' | 'label' | 'image' | 'email' | 'phone' | 'url' | 'summary',
    string
  > & {
    location: Location;
    profiles: Profile[];
  }
>;

export type Work = Partial<
  Record<
    'name' | 'position' | 'url' | 'startDate' | 'endDate' | 'summary',
    string
  > &
    Highlights
>;

export type Volunteer = Partial<
  Record<
    'organization' | 'position' | 'url' | 'startDate' | 'endDate' | 'summary',
    string
  > &
    Highlights
>;

export type Education = Partial<
  Record<
    | 'institution'
    | 'url'
    | 'area'
    | 'studyType'
    | 'startDate'
    | 'endDate'
    | 'score',
    string
  > & {
    courses: string[];
  }
>;

export type Award = Partial<
  Record<'title' | 'date' | 'awarder' | 'summary', string>
>;

export type Certificate = Partial<
  Record<'name' | 'date' | 'issuer' | 'url', string>
>;

export type Publication = Partial<
  Record<'name' | 'publisher' | 'releaseDate' | 'url' | 'summary', string>
>;

export type Skill = Partial<Record<'name' | 'level', string> & Keywords>;

export type Language = Partial<Record<'language' | 'fluency', string>>;

export type Interest = Partial<Record<'name', string> & Keywords>;

export type Reference = Partial<Record<'name' | 'reference', string>>;

export type Project = Partial<
  Record<'name' | 'startDate' | 'endDate' | 'description' | 'url', string> &
    Highlights
>;

export type Expansion = Partial<Record<string, unknown>>;

export type Resume = Partial<{
  basics: Basics;
  work: Work[];
  volunteer: Volunteer[];
  education: Education[];
  awards: Award[];
  certificates: Certificate[];
  publications: Publication[];
  skills: Skill[];
  languages: Language[];
  interests: Interest[];
  references: Reference[];
  projects: Project[];
}>;

export type ResumeExpansion = Partial<{
  basics: Basics & Expansion;
  work: (Work & Expansion)[];
  volunteer: (Volunteer & Expansion)[];
  education: (Education & Expansion)[];
  awards: (Award & Expansion)[];
  certificates: (Certificate & Expansion)[];
  publications: (Publication & Expansion)[];
  skills: (Skill & Expansion)[];
  languages: (Language & Expansion)[];
  interests: (Interest & Expansion)[];
  references: (Reference & Expansion)[];
  projects: (Project & Expansion)[];
}> &
  Expansion;
