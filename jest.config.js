module.exports = {
  // verbose: true,
  moduleNameMapper: {
    "^\@/(.*\.*)": "<rootDir>/src/$1"
  },
  testEnvironment: "<rootDir>/test/utils/mongo/environment.js",
  globalSetup: "<rootDir>/test/utils/mongo/setup.js",
  globalTeardown: "<rootDir>/test/utils/mongo/teardown.js"
}