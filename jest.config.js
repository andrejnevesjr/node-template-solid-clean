/** @type {import('ts-jest').JestConfigWithTsJest} */
module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  transform: {
    '^.+\\.ts$': ['ts-jest', { tsconfig: 'tsconfig.jest.json' }],
  },
  moduleNameMapper: {
    '^@domain/(.*)$': '<rootDir>/src/domain/$1',
    '^@infra/(.*)$': '<rootDir>/src/infra/$1',
    '^@package/(.*)$': '<rootDir>/src/package/$1',
    '^@usecases/(.*)$': '<rootDir>/src/usecases/$1',
    '^@types/(.*)$': '<rootDir>/src/types/$1',
  },
  resolver: 'jest-ts-webcompat-resolver',
};
