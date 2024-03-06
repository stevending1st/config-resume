import tailwind from "@astrojs/tailwind";
import { i18nPlugin } from '@config-resume/cli';
import { defineConfig } from 'astro/config';

// https://astro.build/config
export default defineConfig({
  base: "",

  trailingSlash: 'never',

  integrations: [
    tailwind(),
    {
      name: "config-resume-plugin",
      hooks: {
        'astro:config:setup': ({ updateConfig }) => {
          updateConfig({
            vite: {
              plugins: [i18nPlugin()],
            }
          })
        }
      },
    },
  ]
});