'use strict';

const readPodfile = require('./readPodfile');

module.exports = function isInstalled(iOSProject, dependencyConfig) {
  if (!iOSProject.podfile) {
    return false;
  }
  const dependencyRegExp = new RegExp('pod\\s+(\'|\")' + dependencyConfig.podspec + '(\'|\")', 'g');
  const podLines = readPodfile(iOSProject.podfile);
  for (let i = 0, len = podLines.length; i < len; i++) {
    const match = podLines[i].match(dependencyRegExp);
    if (match) {
      return true;
    }
  }
  return false;
};
