const { lighthouse, prepareAudit } = require("@cypress-audit/lighthouse");

module.exports = {
  e2e: {
    baseUrl: "https://www.autonoma.edu.co",
    setupNodeEvents(on, config) {
      on("before:browser:launch", (browser, launchOptions) => {
        prepareAudit(launchOptions);
    });

      on("task", {
        lighthouse: lighthouse(),
      });
    },
  },
};

