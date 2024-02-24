import yargs from 'yargs';
import { hideBin } from 'yargs/helpers';

import pkginfo from '../package.json';

const cli = yargs(hideBin(process.argv))
  .scriptName('command-start')
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
  ({ parameter, option }) =>
    console.log(
      `You passed the [${parameter}] parameter to the command and selected the [${option?.join(',')}] option`
    )
);

cli.command(
  'subcommand',
  'Call subcommand',
  args => args.strict().help(),
  ({ _ }) => console.log(`The [${_.join(' ')}] subcommand was called by you.`)
);

cli
  .showHelpOnFail(false, 'Specify --help for available options')
  .help()
  .parse();
