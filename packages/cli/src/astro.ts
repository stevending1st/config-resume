import { AstroInlineConfig, build, dev, preview } from 'astro';

export const createAstroServer = (config?: AstroInlineConfig) => {
  const { base } = config ?? {};

  return dev({
    root: '.',
    base
  });
};

export const buildAstro = (config?: AstroInlineConfig) => {
  const { base } = config ?? {};

  process.chdir('./.config-resume');

  return build({
    outDir: '../dist',
    base
  });
};

export const previewAstro = (config?: AstroInlineConfig) => {
  const { base } = config ?? {};

  return preview({
    outDir: './dist',
    base
  });
};
