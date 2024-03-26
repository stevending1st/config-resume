import yargs from 'yargs';
import { hideBin } from 'yargs/helpers';

import pkginfo from '../package.json';
import { createBuild, createDev, createPreview } from './server';

const cli = yargs(hideBin(process.argv))
  .scriptName('cr')
  .usage('$0 [args]')
  .version(pkginfo.version)
  .strict()
  .showHelpOnFail(false)
  .alias('h', 'help')
  .alias('v', 'version');

cli.command(
  '* [parameter]',
  'Example of passing parameters',
  args =>
    args
      .option('b', {
        alias: 'base',
        describe: 'The base path to deploy to.',
        type: 'string'
      })
      .strict()
      .help(),
  ({ base }) => createDev({ base: base as string | undefined })
);

cli.command(
  'build',
  'build',
  args =>
    args
      .option('b', {
        alias: 'base',
        describe: 'The base path to deploy to.',
        type: 'string'
      })
      .strict()
      .help(),
  ({ base }) => createBuild({ base: base as string | undefined })
);

cli.command(
  'preview',
  'preview',
  args =>
    args
      .option('b', {
        alias: 'base',
        describe: 'The base path to deploy to.',
        type: 'string'
      })
      .strict()
      .help(),
  ({ base }) => createPreview({ base: base as string | undefined })
);

cli
  .showHelpOnFail(false, 'Specify --help for available options')
  .help()
  .parse();
