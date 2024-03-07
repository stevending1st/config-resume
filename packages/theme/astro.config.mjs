import tailwind from "@astrojs/tailwind";
import { configResume } from '@config-resume/cli';
import { defineConfig } from 'astro/config';

// https://astro.build/config
export default defineConfig({
  base: "",

  trailingSlash: 'never',

  integrations: [configResume(), tailwind()]
});
