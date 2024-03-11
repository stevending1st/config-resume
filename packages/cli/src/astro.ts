import { build, dev, preview } from 'astro';

export const createAstroServer = () =>
  dev({
    root: '.'
  });

export const buildAstro = () => {
  process.chdir('./.config-resume');

  build({ outDir: '../dist' });
};

export const previewAstro = async () => {
  await preview({
    outDir: './dist'
  });
};
