export default {
    transform: {
      "^.+\\.(js|jsx)$": "babel-jest"
    },
    testEnvironment: "jest-environment-jsdom",
    setupFilesAfterEnv: ["<rootDir>/src/test/setupTests.js"],
  };