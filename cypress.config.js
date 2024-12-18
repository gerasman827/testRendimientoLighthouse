const { defineConfig } = require('cypress');
const { exec } = require('child_process');

module.exports = defineConfig({
  e2e: {
    baseUrl: 'https://www.autonoma.edu.co',
    setupNodeEvents(on, config) {
      on('task', {
        runLighthouse({ url, outputPath, config }) {
          return new Promise((resolve, reject) => {
            exec(
              `npx lighthouse ${url} ${config} --output json --output-path ${outputPath}`,
              (error, stdout, stderr) => {
                if (error) {
                  console.error('Error ejecutando Lighthouse:', stderr);
                  return reject(stderr);
                }
                console.log('Lighthouse ejecutado correctamente:', stdout);
                resolve(`Reporte generado en ${outputPath}`);
              }
            );
          });
        },
      });
    },
  },
});

