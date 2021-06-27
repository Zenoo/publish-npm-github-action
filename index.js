const core = require('@actions/core');
const github = require('@actions/github');
const { exec } = require('child_process');
const fs = require('fs');
const path = require('path');
const pkg = require('../package.json');

(async () => {
  try {
    /**
     * Parameters
     */
    const parameters = {
      publishToNpm: core.getInput('publish-to-npm') === 'true',
      publishToGithub: core.getInput('publish-to-github') === 'true',
      githubScope: core.getInput('github-scope') || github.context.payload.repository.owner.login.toLowerCase(),
      githubPackageName: core.getInput('github-package-name') || github.context.payload.repository.name.toLowerCase()
    };


    exec(`cd .. && ls -a`, (err, stdout, stderr) => {
      if (err) {
        // node couldn't execute the command
        throw err;
      }

      console.log('Published to npm.');

      // the *entire* stdout and stderr (buffered)
      console.log(`stdout: ${stdout}`);
      console.log(`stderr: ${stderr}`);
    });

    /**
     * Publish to NPM
     */
    const publishToNpm = async () => {
      console.log('Publishing to npm ...');

      // Update registry for npm
      if (!pkg.publishConfig) pkg.publishConfig = {};
      pkg.publishConfig.registry = 'https://registry.npmjs.org';

      // Update package.json with the udpated registry
      fs.writeFileSync(
        path.join(__dirname, '../package.json'),
        JSON.stringify(pkg, null, 2),
      );

      exec(`npm ci && npm publish`, (err, stdout, stderr) => {
        if (err) {
          // node couldn't execute the command
          throw err;
        }

        console.log('Published to npm.');

        // the *entire* stdout and stderr (buffered)
        console.log(`stdout: ${stdout}`);
        console.log(`stderr: ${stderr}`);
      });
    };

    if (parameters.publishToNpm) {
      await publishToNpm();
    }


    /**
     * Publish to Github
     */
    const publishToGithub = async () => {
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

      exec(`npm publish`, (err, stdout, stderr) => {
        if (err) {
          // node couldn't execute the command
          throw err;
        }

        console.log('Published to Github.');

        // the *entire* stdout and stderr (buffered)
        console.log(`stdout: ${stdout}`);
        console.log(`stderr: ${stderr}`);
      });
    };

    if (parameters.publishToGithub) {
      await publishToGithub();
    }
  } catch (error) {
    core.setFailed(error.message);
  }
})();