'use strict';

module.exports = function addPodEntry(podLines, lineToAddEntry, packagePodspecName, nodeName) {

  const newEntry = packagePodspecName ?
    `  pod '${packagePodspecName}', :path => '../node_modules/${nodeName}'\n` :
    `  pod '${nodeName}', :path => '../node_modules/${nodeName}', :podspec => './${nodeName}.podspec'\n`; //used when package do not have own podspec

  podLines.splice(lineToAddEntry, 0, newEntry);
};
