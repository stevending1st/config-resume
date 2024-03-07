import { type Resume } from '@config-resume/types';
import fs from 'fs-extra';
import path from 'path';
import { type PluginOption, ViteDevServer } from 'vite';

export type ResumeCache = Record<string, Resume>;

const loadResumeFolder = async (dir: string) => {
  const isExistsFolder = await fs.exists(dir);
  if (!isExistsFolder) return;

  const files = await fs.readdir(dir);
  const resume = {} as ResumeCache;

  for await (const fileDir of files) {
    const subDir = path.join(dir, fileDir);
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

    try {
      const json = await fs.readJson(subDir);
      resume[thisLang[0].toLowerCase()] = json;
    } catch (error: unknown) {
      console.log('ERR:', error?.toString());
    }
  }

  return resume;
};

export function loadResumePlugin(): PluginOption {
  const virtualModuleId = 'virtual:config-resume:resume';
  const resolvedVirtualModuleId = '\0' + virtualModuleId;

  let lang = 'en';
  let resumeCache = {} as ResumeCache;

  const themeResumeFolder = './src/mock';
  const userResumeFolder = '.';

  const loadResume = async () => {
    const resume = (await loadResumeFolder(userResumeFolder)) || {};

    if (Object.keys(resume).length > 0) return resume;
    const res = (await loadResumeFolder(themeResumeFolder)) || {};
    return res;
  };

  return {
    name: 'config-resume:resume',

    async options() {
      resumeCache = await loadResume();
    },

    resolveId(id: string) {
      if (id === virtualModuleId) return resolvedVirtualModuleId;
    },

    load(id: string) {
      if (id === resolvedVirtualModuleId) {
        return `export default ${JSON.stringify(resumeCache[lang])}`;
      }
    },

    configureServer(server: ViteDevServer) {
      const reloadModule = async (moduleId: string) => {
        const mod = await server.moduleGraph.getModuleByUrl(moduleId);

        if (mod) server.reloadModule(mod);
      };

      const watchResumeCB = async () => {
        resumeCache = await loadResume();
        await reloadModule(resolvedVirtualModuleId);
      };

      server.middlewares.use(async (req, _, next) => {
        const urlObj = new URL(req?.url || '', `http://${req.headers.host}`);

        let newLang = lang;
        if (urlObj.pathname === '/') {
          newLang = urlObj.searchParams.get('lang') || 'en';
        } else {
          const pathLanguage = urlObj.pathname.slice(1);

          if (Object.keys(resumeCache).includes(pathLanguage))
            newLang = pathLanguage;
        }

        if (newLang !== lang) {
          lang = newLang;
          await reloadModule(resolvedVirtualModuleId);
        }

        next();
      });

      server.watcher.add(['./*.json', './src/mock/*.json']);
      server.watcher.on('all', watchResumeCB);
    }
  };
}

export default loadResumePlugin;
