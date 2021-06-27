# Publish to NPM & Github action

Publish your package on NPM, Github or both, without much configuration.

## Optional inputs

## `publish-to-npm`

**Optional** Should your package be published to npm? Defaults to `true`

## `publish-to-github`

**Optional** Should your package be published to Github? Defaults to `true`

## `github-scope`

**Optional** Custom scope for the Github publication. Defaults to the repository owner

## `github-package-name`

**Optional** Custom package name for the Github publication. Defaults to your repository name


## Example usage

If you want to publish to NPM, you'll need to add a token to your repository's secrets.  
See [npm's documentation](https://docs.npmjs.com/creating-and-viewing-access-tokens) to generate your token.  
Add this token to your repository as a secret named `NPM_TOKEN`.

Add a `.github/workflows/publish.yml` file to your repository.

```yml
name: Publish to NPM & Github

on:
  push:
    tags:
      - 'v*.*.*'

jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - uses: zenoo/publish-npm-github-action@v1.1.4
        env:
          GITHUB_TOKEN: ${{ secrets.GITHUB_TOKEN }}
          NPM_TOKEN: ${{ secrets.NPM_TOKEN }}
```

OR

```yml
name: Publish to NPM & Github

on:
  push:
    tags: 
      - 'v*.*.*'

jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - uses: zenoo/publish-npm-github-action@v1.1.4
        with:
          publish-to-npm: false
          github-scope: 'customscope'
          github-package-name: 'custompackagename'
        env:
          GITHUB_TOKEN: ${{ secrets.GITHUB_TOKEN }}
          NPM_TOKEN: ${{ secrets.NPM_TOKEN }}
```
