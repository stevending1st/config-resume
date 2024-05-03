import { loadConfig } from 'unconfig';

interface ConfigResumeConfig {
  theme?: string;
}

export const defineConfig = (config: ConfigResumeConfig) => config;

export const readConfig = () =>
  loadConfig<ConfigResumeConfig>({
    sources: [
      {
        files: 'config-resume.config',
        extensions: ['ts', 'mts', 'cts', 'js', 'mjs', 'cjs', 'json']
      }
    ]
  });
