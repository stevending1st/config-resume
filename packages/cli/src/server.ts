import path, { basename, join } from 'node:path';

import { parseNi, run } from '@antfu/ni';
import { type AstroInlineConfig } from 'astro';
import chokidar from 'chokidar';
import { execa } from 'execa';
import fs from 'fs-extra';
import isInstalledGlobally from 'is-installed-globally';
import { rimraf } from 'rimraf';

import { buildAstro, createAstroServer, previewAstro } from './astro';
import { readConfig } from './config';
import {
  findNpmAndYarnGlobalPkgPath,
  findPkgPath,
  safeCopyWithoutCover
} from './fs';

export const getLangListFromFile = async () => {
  const dirs = await fs.readdir('./');

  const langList = [];

  for (const dir of dirs) {
    const subDir = path.join('./', dir);
    const stats = await fs.statSync(subDir);
    const isFile = stats.isFile();

    if (!isFile) continue;

    const { ext, name } = path.parse(subDir);

    const nameArr = name.split('.');
    const thisName = nameArr[0];
    const thisLang = nameArr.slice(1);

    if (
      ext.toLowerCase() !== '.json' ||
      thisName.toLowerCase() !== 'resume' ||
      thisLang.length !== 1 ||
      thisLang[0].length <= 0
    )
      continue;

    // Valid json verification
    try {
      const jsonBufferContent = await fs.readFile(subDir);
      JSON.parse(jsonBufferContent.toString('utf-8'));
    } catch {
      /* empty */
    }

    langList.push(thisLang[0]);
  }

  return langList;
};

export const pretreatment = async (action: 'dev' | 'build' = 'dev') => {
  console.log('Welcome to use config-resume!');

  const crPath = await findPkgPath('@config-resume/cli');

  if (!crPath) {
    console.log('@config-resume/cli cannot be found.');

    if (isInstalledGlobally) {
      console.log('Please use npm or yarn global installation.');
    } else {
      console.log('Please install it in this project.');
    }

    return;
  }

  // load config
  const { config, sources } = await readConfig();
  console.log(`load config: ${sources[0]}`);

  // resume file
  const langList = (await getLangListFromFile()).filter(
    value => value === value.toLowerCase()
  );

  if (!langList.length) {
    await safeCopyWithoutCover(
      join(crPath, 'template/resume.en.json'),
      './resume.en.json'
    );
  }

  // copy .gitignore
  if (await fs.exists('./.gitignore')) {
    const gitignoreBufferContent = await fs.readFile('./.gitignore');
    const gitignoreContent = gitignoreBufferContent.toString('utf-8');
    const hasProjectIgnore = gitignoreContent
      .split('\n')
      .some(
        value => value === '.config-resume' || value === '.config-resume\r'
      );
    if (!hasProjectIgnore) {
      await fs.appendFile('./.gitignore', '.config-resume');
    }
  } else {
    await fs.copy(join(crPath, 'template/.template-gitignore'), './.gitignore');
  }

  // copy package.json
  if (
    !(await safeCopyWithoutCover(
      join(crPath, 'template/package.json'),
      './package.json'
    ))
  ) {
    console.log('Failed to create package.json.');
    return;
  }

  await run(parseNi, []);

  // delete .config-resume
  await rimraf('./.config-resume');

  const themeName = config?.theme ?? '@config-resume/theme';
  console.log(`Use themes: ${themeName}`);
  let themePath = await findNpmAndYarnGlobalPkgPath(themeName);

  if (!themePath) {
    // install theme
    await execa('npm', ['install', '-g', themeName], {
      stdio: 'inherit'
    });
    themePath = await findNpmAndYarnGlobalPkgPath(themeName);
  }

  // copy theme file
  if (!themePath) {
    console.log('Unable to find template file');
    return false;
  }
  await safeCopyWithoutCover(themePath, './.config-resume');

  // Create a multilingual page
  if (action === 'build') {
    const pageFilePath = join('./.config-resume', 'src/pages/index.astro');

    const isExistPageFile = await fs.exists(pageFilePath);

    if (!isExistPageFile) {
      console.log('Unable to find page file.');
      return false;
    }

    for (const lang of langList) {
      await safeCopyWithoutCover(
        pageFilePath,
        join('./.config-resume', `src/pages/${lang}.astro`)
      );
    }

    await fs.remove(pageFilePath);
  }

  const rootRealpath = await fs.realpath('./');

  // watch resume files
  const mockDir = await fs.realpath('./.config-resume/src/mock');
  await fs.emptyDir(mockDir);
  const watchResumeAddAndChangeCb = async (path: string) => {
    try {
      const jsonBufferContent = await fs.readFile(path);
      const jsonContent = jsonBufferContent.toString('utf-8');
      // Valid json verification
      JSON.parse(jsonContent);
      const baseName = basename(path);
      await fs.writeFile(join(mockDir, baseName), jsonContent, {
        encoding: 'utf8',
        flag: 'w'
      });
    } catch {
      /* empty */
    }
  };

  const resumeWatcher = chokidar.watch(join(rootRealpath, 'resume.*.json'));
  resumeWatcher.on('add', watchResumeAddAndChangeCb);
  resumeWatcher.on('change', watchResumeAddAndChangeCb);
  resumeWatcher.on('unlink', async filePath => {
    const baseName = basename(filePath);
    await fs.remove(join(mockDir, baseName));
  });

  // watch i18n
  await fs.emptyDir('./.config-resume/user-i18n');
  const userI18nDir = await fs.realpath('./.config-resume/user-i18n');

  const watchUserI18nAddAndChangeCb = async (path: string) => {
    try {
      const jsonBufferContent = await fs.readFile(path);
      const jsonContent = jsonBufferContent.toString('utf-8');
      // Valid json verification
      JSON.parse(jsonContent);
      const baseName = basename(path);
      await fs.writeFile(join(userI18nDir, baseName), jsonContent, {
        encoding: 'utf8',
        flag: 'w'
      });
    } catch {
      /* empty */
    }
  };

  const i18nWatcher = chokidar.watch(
    join(await fs.realpath('./'), 'i18n/*.json')
  );
  i18nWatcher.on('add', watchUserI18nAddAndChangeCb);
  i18nWatcher.on('change', watchUserI18nAddAndChangeCb);
  i18nWatcher.on('unlink', async filePath => {
    const baseName = basename(filePath);
    await fs.remove(join(userI18nDir, baseName));
  });

  // watch static files
  const destPublicDir = await fs.realpath('./.config-resume/public');
  const watchStaticFileAddAndChangeCb = async (filePath: string) => {
    const fileName = basename(filePath);
    const destFile = join(destPublicDir, fileName);
    await fs.copy(filePath, destFile);
  };

  const staticFileWatcher = chokidar.watch(join(rootRealpath, '/public'), {
    ignored: join(rootRealpath, '/public/theme')
  });
  staticFileWatcher.on('add', watchStaticFileAddAndChangeCb);
  staticFileWatcher.on('change', watchStaticFileAddAndChangeCb);
  staticFileWatcher.on('unlink', async filePath => {
    const baseName = basename(filePath);
    await fs.remove(join(destPublicDir, baseName));
  });

  // close watch
  if (action === 'build') {
    await resumeWatcher.close();
    await i18nWatcher.close();
    await staticFileWatcher.close();
  }

  return true;
};

export const createDev = async (config?: AstroInlineConfig) => {
  const isSuccess = await pretreatment('dev');

  if (!isSuccess) return;

  process.chdir('./.config-resume');

  await createAstroServer(config);
};

export const createBuild = async (config?: AstroInlineConfig) => {
  const isSuccess = await pretreatment('build');

  if (!isSuccess) return;

  await buildAstro(config);
};

export const createPreview = async (config?: AstroInlineConfig) => {
  await previewAstro(config);
};
