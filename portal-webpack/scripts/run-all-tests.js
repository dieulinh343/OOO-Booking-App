const shell = require('shelljs');

const codes = [];

const exec = ((command, ignoreCode = false) => {
  console.log('Executing: ', command);

  const code = shell.exec(command).code;
  console.log('Exit code:', code);
  if (!ignoreCode) {
    codes.push(code);
  }
});

process.env.NODE_ENV = 'development';

exec('rm -rf .nyc_output build coverage cypress-coverage jest-coverage cov-reports');
exec('node ../../portal-webpack/scripts/test.js --watchAll=false --coverage');
exec('./cypress-run.sh');
exec('mochawesome-merge cypress-report/*.json > cypress-report/output.json && marge cypress-report/output.json --reportDir cypress-report');

if (codes.find(code => code !== 0)) {
  process.exit(1);
} else {
  process.exit(0);
}
