#!/usr/bin/env zx

import { join } from 'node:path';

import { fs } from 'zx';

const templates = [
  'packages/cli/template',
]

const { version } = await fs.readJSON('package.json')

for (const template of templates) {
  const path = join(template, 'package.json');

  if(!(await fs.exists(path))) continue;

  const pkg = await fs.readJSON(path)
  const deps = ['dependencies', 'devDependencies']

  for (const name of deps) {
    if (!pkg[name]) continue;

    const pkgMap = new Map(Object.entries(pkg[name]));
    for(const [key] of pkgMap) {
      if(key.startsWith('@config-resume')) pkgMap.set(key, version);
    }
    pkg[name] = Object.fromEntries(pkgMap.entries());
  }

  await fs.writeJSON(path, pkg, { spaces: 2 });
}
