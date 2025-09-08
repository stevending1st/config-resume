import i18n, { type I18nType, supportedLanguages } from '@config-resume/i18n';
import { SupportedLanguage } from '@config-resume/types';
import fs from 'fs-extra';
import path, { join } from 'path';
import { type PluginOption, ViteDevServer } from 'vite';

import { findFileDirs } from '../utils/fs';

export const mergeI18n = (baseI18n: I18nType, newI18n: I18nType) => {
  const resultI18n: I18nType = {};

  for (const prop in baseI18n) {
    resultI18n[prop] = { ...baseI18n[prop] };
  }

  for (const prop in newI18n) {
    if (!Object.prototype.hasOwnProperty.call(resultI18n, prop)) {
      resultI18n[prop] = { ...newI18n[prop] };
    } else {
      resultI18n[prop] = { ...resultI18n[prop], ...newI18n[prop] };
    }
  }

  return resultI18n;
};

const loadI18nFolder = async (dir: string) => {
  const isExistsFolder = await fs.exists(dir);

  if (!isExistsFolder) return;

  const files = await fs.readdir(dir);

  const i18n = {} as I18nType;

  for await (const fileDir of files) {
    const subDir = path.join(dir, fileDir);
    const stats = await fs.statSync(subDir);
    const isFile = stats.isFile();

    if (!isFile) continue;

    const { ext, name } = path.parse(subDir);

    if (ext.toLowerCase() !== '.json' && name) continue;

    try {
      const json = await fs.readJson(subDir);
      i18n[name.toLowerCase()] = json;
    } catch (error: unknown) {
      console.log('ERR:', error?.toString());
    }
  }

  return i18n;
};

const mergeAndFilterSupportedLangs = (
  baseSupporedLangs: SupportedLanguage[],
  userLangs: string[],
  command: string
) => {
  const supporedLangs = baseSupporedLangs
    .filter(({ code }) => userLangs.includes(code))
    .map(({ code, ...others }) => ({
      ...others,
      code,
      path: `${command === 'build' ? '/' : '?lang='}${code}`
    }));

  for (const lang of userLangs) {
    if (supporedLangs.findIndex(({ code }) => code == lang) === -1) {
      supporedLangs.push({
        code: lang,
        path: `${command === 'build' ? '/' : '?lang='}${lang}`,
        name: lang
      });
    }
  }

  return supporedLangs;
};

const markCurrentLang = (
  supporedLangs: SupportedLanguage[],
  currentLang?: string
) =>
  supporedLangs.map(({ code, ...other }) => ({
    code,
    ...other,
    isCurrent: code === currentLang
  }));

const i18nPluginLoad = (defaultValue: string, languages?: string) =>
  `export const supportedLanguages = ${languages ?? '[]'};

export default ${defaultValue};`;

export function i18nPlugin(): PluginOption {
  const virtualModuleId = 'virtual:config-resume:i18n';
  const resolvedVirtualModuleId = '\0' + virtualModuleId;

  let thisCommand = 'build';

  let lang = 'en';
  let i18nWithThemeCache = i18n as I18nType;
  let i18nCache = i18n as I18nType;
  let mySupporedLangusges = [] as SupportedLanguage[];

  const renewI18n = async (dir: string, baseI18n: I18nType) => {
    const newI18n = await loadI18nFolder(dir);
    return mergeI18n(baseI18n, newI18n || {});
  };

  const renewSupportedLanguages = async (
    folders: string | string[],
    baseSupportedLanguages: SupportedLanguage[],
    command = 'build'
  ) => {
    const dirs = await findFileDirs(folders, /^resume\.[-\w]+\.json$/);

    const langs = dirs
      .map(dir => {
        const match = /^resume\.([-\w]+)\.json$/.exec(dir);
        return match ? match[1] : '';
      })
      .filter(lang => !!lang);

    return mergeAndFilterSupportedLangs(baseSupportedLanguages, langs, command);
  };

  let workPath = './';
  const resumeFolders: string[] = ['./', './src/mock/'];

  return {
    name: 'config-resume:i18n',

    config(_, { command }) {
      thisCommand = command;
    },

    async options() {
      workPath = await fs.realpath('./');
      i18nWithThemeCache = await renewI18n(join(workPath, './i18n'), i18n);
      if (workPath.endsWith('.config-resume')) {
        i18nCache = await renewI18n(
          join(workPath, './user-i18n'),
          i18nWithThemeCache
        );
      }
      mySupporedLangusges = await renewSupportedLanguages(
        resumeFolders,
        supportedLanguages,
        thisCommand
      );
    },

    resolveId(id: string, importer?: string) {
      if (id === virtualModuleId) {
        const { name } = importer ? path.parse(importer) : { name: 'index' };
        const thisId =
          thisCommand === 'serve'
            ? resolvedVirtualModuleId
            : `${resolvedVirtualModuleId}:${name === 'index' ? lang : name}`;
        return thisId;
      }
    },

    load(id: string) {
      if (id.startsWith(resolvedVirtualModuleId)) {
        const langFlag =
          thisCommand === 'serve' ? lang : id.split(':').slice(-1)[0];
        const thisLang = ['index', ''].includes(langFlag) ? 'en' : langFlag;
        return i18nPluginLoad(
          JSON.stringify(i18nCache[thisLang]),
          JSON.stringify(markCurrentLang(mySupporedLangusges, thisLang))
        );
      }
    },

    configureServer(server: ViteDevServer) {
      const reloadModule = async (moduleId: string) => {
        const mod = await server.moduleGraph.getModuleByUrl(moduleId);

        if (mod) server.reloadModule(mod);
      };

      const watchI18nCB = async () => {
        const watchDir = join(
          workPath,
          workPath.endsWith('.config-resume') ? './user-i18n' : './i18n'
        );
        i18nCache = await renewI18n(watchDir, i18nWithThemeCache);
        await reloadModule(resolvedVirtualModuleId);
      };

      const watchSupportedLanguagesCB = async () => {
        mySupporedLangusges = await renewSupportedLanguages(
          resumeFolders,
          supportedLanguages,
          thisCommand
        );
        await reloadModule(resolvedVirtualModuleId);
      };

      server.middlewares.use(async (req, _, next) => {
        const urlObj = new URL(req?.url || '', `http://${req.headers.host}`);

        let newLang = lang;
        if (urlObj.pathname === '/') {
          newLang = urlObj.searchParams.get('lang') || 'en';
        } else {
          const pathLanguage = urlObj.pathname.slice(1);

          if (Object.keys(i18nCache).includes(pathLanguage))
            newLang = pathLanguage;
        }

        if (newLang !== lang) {
          lang = newLang;
          const thisId =
            thisCommand === 'serve'
              ? resolvedVirtualModuleId
              : `${resolvedVirtualModuleId}:${lang}`;
          await reloadModule(thisId);
        }

        next();
      });

      // watch i18n files
      const watchFiles = join(
        workPath,
        `./${workPath.endsWith('.config-resume') ? 'user-i18n' : 'i18n'}/*.json`
      );
      server.watcher.add(watchFiles);
      server.watcher.on('add', watchI18nCB);
      server.watcher.on('change', watchI18nCB);
      server.watcher.on('unlink', watchI18nCB);

      // watch supporedLangusges
      const watchSupportedLanguagesDir = [
        join(workPath, './resume.*.json'),
        join(workPath, './src/mock/resume.*.json')
      ];
      server.watcher.add(watchSupportedLanguagesDir);
      server.watcher.on('add', watchSupportedLanguagesCB);
      server.watcher.on('change', watchSupportedLanguagesCB);
      server.watcher.on('unlink', watchSupportedLanguagesCB);
    }
  };
}

export default i18nPlugin;
