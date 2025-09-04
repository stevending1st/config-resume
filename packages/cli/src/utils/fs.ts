import { join } from 'node:path';

import fs, { type CopyOptions } from 'fs-extra';
import globalDirs from 'global-directory';
import isInstalledGlobally from 'is-installed-globally';

export const findNpmAndYarnGlobalPkgPath = async (pkgName: string) => {
  const findGlobalPkgPath = async (globalDirs: string, pkgName: string) => {
    const pkgPath = join(globalDirs, pkgName);
    const pkgJsonPath = join(pkgPath, 'package.json');

    if (await fs.exists(pkgJsonPath)) {
      const pkgNameFromPkgJson = await fs.readJSON(pkgJsonPath);

      if (pkgNameFromPkgJson.name === pkgName) return pkgPath;
    }
  };

  const npmPkgPath = await findGlobalPkgPath(globalDirs.npm.packages, pkgName);
  if (npmPkgPath) return npmPkgPath;

  const yarnPkgPath = await findGlobalPkgPath(
    globalDirs.yarn.packages,
    pkgName
  );
  if (yarnPkgPath) return yarnPkgPath;
};

export const findPkgPathFromNodeModules = async (pkgName: string) => {
  const isExistNodeModules = fs.exists('./node_modules');
  if (!isExistNodeModules) return;

  const pkgPath = join('./node_modules', pkgName);
  const isExistPkg = await fs.exists(pkgPath);
  if (isExistPkg) return fs.realpath(pkgPath);
};

export const findPkgPath = async (pkgName: string) => {
  let pkgPath;
  const isExistNodeModules = await fs.exists('./node_modules');

  if (isExistNodeModules && !isInstalledGlobally)
    pkgPath = await findPkgPathFromNodeModules(pkgName);

  if (!pkgPath) pkgPath = await findNpmAndYarnGlobalPkgPath(pkgName);

  if (!pkgPath) return;

  return fs.realpath(pkgPath);
};

export const copyRealFile = async (
  src: string,
  dest: string,
  options?: CopyOptions
) => {
  const realpath = await fs.realpath(src);

  return fs.copy(realpath, dest, options);
};

export const safeCopyWithoutCover = async (src: string, dest: string) => {
  const isExistDestPath = await fs.exists(dest);

  if (!isExistDestPath) {
    const isExistSrcPath = await fs.exists(src);

    if (!isExistSrcPath) return false;

    await copyRealFile(src, dest);
  }

  return true;
};

export const findFileDirs = async (
  folders: string | string[],
  fileRegExp: RegExp
) => {
  const folderArr = Array.isArray(folders) ? folders : [folders];

  const getFilesFromFolder = async (folder: string, fileRegExp: RegExp) => {
    const folderRealPath = await fs.realpath(folder);

    const folderStat = await fs.stat(folderRealPath);
    if (!folderStat.isDirectory()) return [];

    const filesInFoler = [];

    const dirsInFolder = await fs.readdir(folderRealPath);
    for (const dir of dirsInFolder) {
      const dirRealPath = join(folderRealPath, dir);
      const dirStat = await fs.stat(dirRealPath);
      if (dirStat.isFile() && fileRegExp.test(dir)) {
        filesInFoler.push(dir);
      }
    }

    return filesInFoler;
  };

  const fileArr = await Promise.all(
    folderArr.map(folder => getFilesFromFolder(folder, fileRegExp))
  );

  return fileArr.reduce((pre, cur) => [...pre, ...cur], []);
};
