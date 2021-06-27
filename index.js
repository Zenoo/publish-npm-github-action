const core = require('@actions/core');
const github = require('@actions/github');
const { exec } = require('child_process');


try {
  /**
   * Parameters
   */
  const parameters = {
    publishToNpm: core.getInput('publish-to-npm'),
    publishToGithub: core.getInput('publish-to-github'),
    githubScope: core.getInput('github-scope'),
    githubPackageName: core.getInput('github-package-name')
  };
  core.debug(parameters);

  const payload = JSON.stringify(github.context.payload, undefined, 2)
  console.log(`The event payload: ${payload}`);

  // /**
  //  * Publish to NPM
  //  */
  // const publishToNpm = async () => {
  //   core.debug('Publishing to npm ...');
  //   exec('node /publish-npm-github/npm.js && npm ci && npm publish', (err, stdout, stderr) => {
  //     if (err) {
  //       // node couldn't execute the command
  //       throw err;
  //     }

  //     core.debug('Published to npm.');

  //     // the *entire* stdout and stderr (buffered)
  //     core.debug(`stdout: ${stdout}`);
  //     core.debug(`stderr: ${stderr}`);
  //   });
  // };

  // if (parameters.publishToNpm) {
  //   await publishToNpm();
  // }


  // /**
  //  * Publish to Github
  //  */
  // const publishToGithub = async () => {
  //   core.debug('Publishing to Github ...');
  //   exec('node /publish-npm-github/github.js && npm publish', (err, stdout, stderr) => {
  //     if (err) {
  //       // node couldn't execute the command
  //       throw err;
  //     }

  //     core.debug('Published to Github.');

  //     // the *entire* stdout and stderr (buffered)
  //     core.debug(`stdout: ${stdout}`);
  //     core.debug(`stderr: ${stderr}`);
  //   });
  // };

  // if (parameters.publishToGithub) {
  //   await publishToGithub();
  // }
} catch (error) {
  core.setFailed(error.message);
}