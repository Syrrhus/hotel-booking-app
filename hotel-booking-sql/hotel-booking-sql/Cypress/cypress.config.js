const { defineConfig } = require("cypress");

module.exports = defineConfig({
  e2e: {

    specPattern : 'cypress/e2e/**e2e.js',
    watchForFileChanges: false,
    defaultCommandTimeout: 100000,
    testIsolation: false,
    pageLoadTimeout: 100000,

    env: {
      baseURL: "http://localhost:3000/",
      testLoopCount: 1
    },
    setupNodeEvents(on, config) {
      // implement node event listeners here
    },
  },
});
