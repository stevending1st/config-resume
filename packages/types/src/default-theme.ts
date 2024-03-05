import { ComponentCommonProps } from './component';
import { Basics, Resume } from './resume';

export interface BasicsComponentProps
  extends Omit<Basics, 'summary'>,
    ComponentCommonProps {}

export interface SummaryComponentProps
  extends Pick<Basics, 'summary'>,
    ComponentCommonProps {}

export interface EducationComponentProps
  extends Pick<Resume, 'education'>,
    ComponentCommonProps {}

export interface CertificatesComponentProps
  extends Pick<Resume, 'certificates'>,
    ComponentCommonProps {}

export interface SkillsComponentProps
  extends Pick<Resume, 'skills'>,
    ComponentCommonProps {}

export interface LanguagesComponentProps
  extends Pick<Resume, 'languages'>,
    ComponentCommonProps {}

export interface ProjectsComponentProps
  extends Pick<Resume, 'projects'>,
    ComponentCommonProps {}

export interface WorkComponentProps
  extends Pick<Resume, 'work'>,
    ComponentCommonProps {}

export interface PublicationsComponentProps
  extends Pick<Resume, 'publications'>,
    ComponentCommonProps {}

export interface AwardsComponentProps
  extends Pick<Resume, 'awards'>,
    ComponentCommonProps {}

export interface InterestsComponentProps
  extends Pick<Resume, 'interests'>,
    ComponentCommonProps {}

export interface VolunteerComponentProps
  extends Pick<Resume, 'volunteer'>,
    ComponentCommonProps {}

export interface ReferencesComponentProps
  extends Pick<Resume, 'references'>,
    ComponentCommonProps {}
