module.exports = function (w) {
  return {
    files: [
      'src/**/*.ts',
      'src/config/app/*.json',
      'package.json',
      'jest.config.json',
      'tsconfig.json'
      ],

    tests: ['__tests__/**/*.ts'],

    env: {
      type: 'node',
      runnner:'node',
      params: {
        env: 'NODE_ENV=debug'
      }
    },

    testFramework: 'jest'
  };
};