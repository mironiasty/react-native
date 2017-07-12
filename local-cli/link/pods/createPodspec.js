'use strict';

const fs = require('fs');
const path = require('path');
const _ = require('lodash');

function fixGitUrlFromPackageJson(repositoryUrl) {
  return repositoryUrl.replace('git+http', 'http').replace('github.com:', 'https://github.com/');
}

function getReplacemnets(packageJson, iosDependency) {
  return {
    __NAME__: packageJson.name,
    __VERSION__: packageJson.version,
    __LICENSE__: packageJson.license,
    __HOMEPAGE__: packageJson.homepage,
    __AUTHOR__: packageJson.author.name || packageJson.author,
    __GITSOURCE__: fixGitUrlFromPackageJson(packageJson.repository.url || packageJson.repository || ''),
    __SUMMARY__: packageJson.description,
    __BASEDIR__: path.relative(iosDependency.folder, iosDependency.sourceDir) || '.',
  };
}

module.exports = function createPodspec(name, iosPath, iosDependency) {
  const appRoot = process.cwd();
  const modulePackage = require(path.join(appRoot, 'node_modules', name, 'package.json'));

  const podspecTemplate = fs.readFileSync(path.join(__dirname, '../__fixtures__/podspec.template'), 'utf8');

  const newPodspec = _.reduce(getReplacemnets(modulePackage, iosDependency), (result, value, key) => result.replace(key, value), podspecTemplate);
  const newPodspecPath = path.join(iosPath, `${name}.podspec`);
  fs.writeFileSync(newPodspecPath, newPodspec);
  return newPodspecPath;
};
