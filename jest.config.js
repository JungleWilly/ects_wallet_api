module.exports = {
  preset: 'ts-jest',
  transform: {
    '^.+\\.ts?$': 'babel-jest',
  },
  testEnvironment: 'node',
  globals: {
    'ts-jest': {
      isolatedModules: true,
    },
  },
  "testPathIgnorePatterns": ["<rootDir>/src/", "<rootDir>/node_modules/"]
};
