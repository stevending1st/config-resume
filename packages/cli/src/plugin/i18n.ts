import i18n, { type I18nType } from '@config-resume/i18n';
import fs from 'fs-extra';
import path from 'path';
import { type PluginOption, ViteDevServer } from 'vite';

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

export function i18nPlugin(): PluginOption {
  const virtualModuleId = 'virtual:config-resume:i18n';
  const resolvedVirtualModuleId = '\0' + virtualModuleId;

  let lang = 'en';
  let i18nWithThemeCache = i18n as I18nType;
  let i18nCache = i18n as I18nType;

  const renewI18n = async (dir: string, baseI18n: I18nType) => {
    const newI18n = await loadI18nFolder(dir);
    return mergeI18n(baseI18n, newI18n || {});
  };

  return {
    name: 'config-resume:i18n',

    async options() {
      i18nWithThemeCache = await renewI18n(
        './node_modules/.config-remusu/i18n',
        i18n
      );
      i18nCache = await renewI18n('./i18n', i18nWithThemeCache);
    },

    resolveId(id: string) {
      if (id === virtualModuleId) return resolvedVirtualModuleId;
    },

    load(id: string) {
      if (id === resolvedVirtualModuleId) {
        return `export default ${JSON.stringify(i18nCache[lang])}`;
      }
    },

    configureServer(server: ViteDevServer) {
      const reloadModule = async (moduleId: string) => {
        const mod = await server.moduleGraph.getModuleByUrl(moduleId);

        if (mod) server.reloadModule(mod);
      };

      const watchI18nCB = async () => {
        i18nCache = await renewI18n('./i18n', i18nWithThemeCache);
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
          await reloadModule(resolvedVirtualModuleId);
        }

        next();
      });

      server.watcher.add('./i18n/*.json');
      server.watcher.on('add', watchI18nCB);
      server.watcher.on('change', watchI18nCB);
      server.watcher.on('unlink', watchI18nCB);
    }
  };
}

export default i18nPlugin;
