const core = require('@actions/core');
const fs = require('fs');
const github = require('@actions/github');
const { exec } = require('child_process');

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
    

    fs.readdirSync('./').forEach(file => {
      console.log(file);
    });
    fs.readdirSync('./publish-npm-github').forEach(file => {
      console.log(file);
    });

    /**
     * Publish to NPM
     */
    const publishToNpm = async () => {
      console.log('Publishing to npm ...');
      exec(`node /publish-npm-github/npm.js && npm ci && npm publish`, (err, stdout, stderr) => {
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
      exec(`node /publish-npm-github/github.js ${parameters.githubScope} ${parameters.githubPackageName} && npm publish`, (err, stdout, stderr) => {
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