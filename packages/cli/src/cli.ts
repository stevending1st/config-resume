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
      .positional('parameter', {
        type: 'string',
        describe: 'You can pass in a string as a parameter'
      })
      .option('option', {
        alias: 'o',
        type: 'string',
        describe: 'Options (such as option1, option2)',
        choices: ['option1', 'option2'],
        array: true
      })
      .strict()
      .help(),
  () => createDev()
);

cli.command(
  'build',
  'build',
  args => args.strict().help(),
  () => createBuild()
);

cli.command(
  'preview',
  'preview',
  args => args.strict().help(),
  () => createPreview()
);

cli
  .showHelpOnFail(false, 'Specify --help for available options')
  .help()
  .parse();
