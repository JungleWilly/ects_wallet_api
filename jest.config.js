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
  "testPathIgnorePatterns": ["<rootDir>/build/", "<rootDir>/node_modules/"]
};
