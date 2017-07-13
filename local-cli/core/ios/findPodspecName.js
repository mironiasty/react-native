'use strict';

const glob = require('glob');
const path = require('path');

module.exports = function findPodspecName(folder) {

  const podspecs = glob.sync('*.podspec', { cwd: folder });
  const folderParts = folder.split(path.sep);
  const packageName = folderParts[folderParts.length - 1];

  let podspecFile = null;
  if (podspecs.length === 0) {
    // let check if there is generated podspec in ios directory
    const generatedPodspecs = glob.sync('*.podspec', { cwd: path.join(process.cwd(), 'ios') });
    const toSelect = generatedPodspecs.indexOf(packageName + '.podspec');
    podspecFile = toSelect !== -1 ? generatedPodspecs[toSelect] : null;
  }
  else if (podspecs.length === 1) {
    podspecFile = podspecs[0];
  }
  else {
    // if there is more than one podspec, select one that match packageName. Or first one if there is no matches
    const toSelect = podspecs.indexOf(packageName + '.podspec');
    if (toSelect === -1) {
      podspecFile = podspecs[0];
    }
    else {
      podspecFile = podspecs[toSelect];
    }
  }

  return podspecFile && podspecFile.replace('.podspec', '');
};
