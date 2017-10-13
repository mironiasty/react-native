'use strict';

jest.mock('fs');

const findPodspecName = require('../../ios/findPodspecName');
const fs = require('fs');
const projects = require('../../__fixtures__/projects');
const ios = require('../../__fixtures__/ios');

describe('ios::findPodspecName', () => {
  it('returns null if there is not podspec file', () => {
    fs.__setMockFilesystem(projects.flat);
    expect(findPodspecName('')).toBeNull();
  });

  it('returns podspec name if only one exists', () => {
    fs.__setMockFilesystem(ios.pod);
    expect(findPodspecName('/')).toBe('TestPod');
  });

  it('returns podspec name that match packet directory', () => {
    fs.__setMockFilesystem({
      user: {
        PacketName: {
          'Another.podspec': 'empty',
          'PacketName.podspec': 'empty'
        }
      }
    });
    expect(findPodspecName('/user/PacketName')).toBe('PacketName');
  });

  it('returns first podspec name if not match in directory', () => {
    fs.__setMockFilesystem({
      user: {
        packet: {
          'Another.podspec': 'empty',
          'PacketName.podspec': 'empty'
        }
      }
    });
    expect(findPodspecName('/user/packet')).toBe('Another');
  });

  it('returns name of podspec generated in ios directory', () => {
    fs.__setMockFilesystem({
      ios: {
        'generated.podspec': 'empty',
      }
    });
    //this test requires some additional mocking - fs mock prefer absolute paths
    const orignalCwd = process.cwd;
    Object.defineProperty(process, 'cwd', {  
      value: () => '/'
    });
    
    try {
      expect(findPodspecName('node_module/generated')).toBe('generated');
    }
    catch(err) {
      Object.defineProperty(process, 'cwd', {  
        value: () => this.orignalCwd
      });
      throw err;
    }
  });
});
