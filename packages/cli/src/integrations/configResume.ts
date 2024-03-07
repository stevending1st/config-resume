import { type AstroIntegration } from 'astro';

import i18nPlugin from '../plugin/i18n';
import loadResumePlugin from '../plugin/resume';

export default function configResume(): AstroIntegration {
  return {
    name: 'config-resume-plugin',
    hooks: {
      'astro:config:setup': ({ updateConfig }) => {
        updateConfig({
          vite: {
            plugins: [i18nPlugin(), loadResumePlugin()]
          }
        });
      }
    }
  };
}
