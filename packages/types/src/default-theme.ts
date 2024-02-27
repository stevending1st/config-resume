import { Basics, Resume } from './resume';

export interface BasicsComponentProps extends Omit<Basics, 'summary'> {}

export interface SummaryComponentProps extends Pick<Basics, 'summary'> {}

export interface EducationComponentProps extends Pick<Resume, 'education'> {}

export interface CertificatesComponentProps
  extends Pick<Resume, 'certificates'> {}

export interface SkillsComponentProps extends Pick<Resume, 'skills'> {}

export interface LanguagesComponentProps extends Pick<Resume, 'languages'> {}

export interface ProjectsComponentProps extends Pick<Resume, 'projects'> {}

export interface WorkComponentProps extends Pick<Resume, 'work'> {}

export interface PublicationsComponentProps
  extends Pick<Resume, 'publications'> {}

export interface AwardsComponentProps extends Pick<Resume, 'awards'> {}

export interface InterestsComponentProps extends Pick<Resume, 'interests'> {}

export interface VolunteerComponentProps extends Pick<Resume, 'volunteer'> {}

export interface ReferencesComponentProps extends Pick<Resume, 'references'> {}
