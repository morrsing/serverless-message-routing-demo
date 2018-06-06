export const TASKS = {
  package: {
    package: 'package',
    build: 'package-build',
    zip: 'package-zip',
    clean: 'package-clean',
    remove: 'package-remove'
  },
  build: {
    build: 'build',
    babel: 'build-babel',
    assets: 'build-assets',
    clean: 'build-clean'
  },
  test: {
    test: 'test',
    watch: 'watch'
  },
  trigger: {
    trigger: 'trigger'
  }
};

export const STREAMS = {
  event: {
    end: 'end',
    exit: 'exit'
  }
};

export const JSON_SETTINGS = {
  spaces: 4
};

export const INSTALL_COMMAND = 'npm install --production';
