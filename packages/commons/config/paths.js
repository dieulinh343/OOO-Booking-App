

const path = require('path');
const fs = require('fs');

// Make sure any symlinks in the project folder are resolved:
// https://github.com/facebookincubator/create-react-app/issues/637
const appDirectory = fs.realpathSync(process.cwd());
const resolveApp = relativePath => path.resolve(appDirectory, relativePath);

// config after eject: we're in ./config/
module.exports = {
  dotenv: resolveApp('.env'),
  appBuild: resolveApp('.'),
  appIndexJs: resolveApp('src/index.js'),
  appPackageJson: resolveApp('package.json'),
  appSrc: resolveApp('src'),
  yarnLockFile: resolveApp('yarn.lock'),
  testsSetup: resolveApp('src/setupTests.js'),
  appNodeModules: resolveApp('node_modules'),
  rootNodeModules: resolveApp('../../node_modules'),
  entry: {
    utils: resolveApp('src/utils/index.js'),
    middlewares: resolveApp('src/middlewares/index.js'),
    hooks: resolveApp('src/hooks/index.js'),
    components: resolveApp('src/components/index.js'),
    constants: resolveApp('src/constants/index.js'),
  },
};
