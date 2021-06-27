const core = require('@actions/core');
const github = require('@actions/github');
const util = require('util');
const exec = util.promisify(require('child_process').exec);
const fs = require('fs');
const path = require('path');
const pkg = require('../package.json');

(async () => {
  try {
    /**
     * Parameters
     */
    const parameters = {
      publishToNpm: process.env.INPUT_PUBLISH_TO_NPM === 'true',
      publishToGithub: process.env.INPUT_PUBLISH_TO_GITHUB === 'true',
      githubScope: process.env.INPUT_GITHUB_SCOPE || github.context.payload.repository.owner.login.toLowerCase(),
      githubPackageName: process.env.INPUT_GITHUB_PACKAGE_NAME || github.context.payload.repository.name.toLowerCase()
    };

    console.log(parameters);

    /**
     * Publish to NPM
     */
    if (parameters.publishToNpm) {
      console.log('Publishing to npm ...');

      // Update registry for npm
      if (!pkg.publishConfig) pkg.publishConfig = {};
      pkg.publishConfig.registry = 'https://registry.npmjs.org';

      // Update package.json with the udpated registry
      fs.writeFileSync(
        path.join(__dirname, '../package.json'),
        JSON.stringify(pkg, null, 2),
      );

      const { stdout, stderr } = await exec('npm ci && npm publish --access public');
      console.log('stdout:', stdout);
      console.log('stderr:', stderr);
      if(!stderr) console.log('Published to npm.');
    }

    /**
     * Publish to Github
     */
    if (parameters.publishToGithub) {
      console.log('Publishing to Github ...');

      // Update registry for Github
      if (!pkg.publishConfig) pkg.publishConfig = {};
      pkg.publishConfig.registry = 'https://npm.pkg.github.com/';

      // Update package name for Github
      const [scope, packageName] = process.argv.slice(2);
      pkg.name = `@${scope}/${packageName}`;

      // Update package.json with the udpated registry
      fs.writeFileSync(
        path.join(__dirname, '../package.json'),
        JSON.stringify(pkg, null, 2),
      );

      const { stdout, stderr } = await exec('npm publish --access public');
      console.log('stdout:', stdout);
      console.log('stderr:', stderr);
      if(!stderr) console.log('Published to Github.');
    }

  } catch (error) {
    core.setFailed(error.message);
  }
})();