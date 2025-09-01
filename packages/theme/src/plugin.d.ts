declare module 'virtual:config-resume:i18n' {
  export const supportedLanguages: import('@config-resume/types').SupportedLanguage[];

  export default import('@config-resume/i18n').I18nItemExpansionType;
}

declare module 'virtual:config-resume:resume' {
  export default import('@config-resume/types').ResumeExpansion;
}
