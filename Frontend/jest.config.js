// jest.config.js
module.exports = {
  setupFilesAfterEnv: ['<rootDir>/src/setupTests.js'],
  moduleNameMapper: {
    '\\.(css|less|sass|scss)$': '<rootDir>/__mocks__/styleMock.js'
  },
  transform: {
    "^.+\\.jsx?$": "babel-jest"
  },
  moduleNameMapper: {
    "\\.(css|less)$": "<rootDir>/__mocks__/styleMock.js",
    "leaflet": "<rootDir>/node_modules/leaflet/dist/leaflet.js",
    "react-leaflet": "<rootDir>/node_modules/react-leaflet/lib/index.js"
  },
  testEnvironment: 'jsdom'
};
