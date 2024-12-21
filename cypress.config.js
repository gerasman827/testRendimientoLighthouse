const fs = require("fs");
const { lighthouse, prepareAudit } = require("@cypress-audit/lighthouse");

module.exports = {
  e2e: {
    baseUrl: "http://www.autonoma.edu.co",
    setupNodeEvents(on, config) {
      on("before:browser:launch", (browser = {}, launchOptions) => {
        prepareAudit(launchOptions);
      });

      on('task', {
        processAndUploadData: async () => {
          try {
            // Llama a la función asíncrona y espera a que se resuelva
            const result = await processAndUploadData();
            return result;  // Retorna los datos procesados a Cypress
          } catch (error) {
            console.error('Error al ejecutar processAndUploadData:', error);
            return null;  // Retorna null si ocurre un error
          }
        },
      });


      on("task", {
        lighthouse: lighthouse((lighthouseReport) => {
          const filePath = "./cypress/fixtures/lighthouse-report.json";

          let data = [];
          if (fs.existsSync(filePath)) {
            try {
              const fileContent = fs.readFileSync(filePath, "utf-8");
              data = JSON.parse(fileContent);
            } catch (error) {
              console.error("Error leyendo el archivo", error);
            }
          }

          const {lhr} = lighthouseReport;
          const report = {
            viewport: lhr.configSettings['formFactor'],
            date: lhr.fetchTime,
            firstContentfulPaint_FCP: lhr.audits['first-contentful-paint'].numericValue,
            largestContentfulPaint_LCP: lhr.audits['largest-contentful-paint'].numericValue,
            cumulativeLayoutShift_CLS: lhr.audits['cumulative-layout-shift'].numericValue,
            speedIndex_SI: lhr.audits['speed-index'].numericValue,
          }
          
          data.push(report);

          fs.writeFile(filePath, JSON.stringify(data, null, 2), (error) => {
            error ? console.error("Error escribiendo el archivo", error) : console.log("Reporte adicionado exitosamente");
          });
          

          return true;
        })
      });
    },
  },
};
