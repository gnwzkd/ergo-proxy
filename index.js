const commander = require('commander');
const package = require('./package');

commander.version(package.version)
  .description(package.description)
  .option('client', 'run client.')
  .option('server', 'run server.')
  .option('-c --config <path>', 'config file path.')
  .parse(process.argv);

const mode = commander.client ? 'client' : (commander.server && 'server');

if (mode) {
  try {
    config = require(commander.config || `./${mode}.config`);
  } catch (e) {
    console.log('invalid config path.');
    return;
  }
  require(`./${mode}`)(config);
}
