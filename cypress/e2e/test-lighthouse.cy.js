describe("Pruebas de rendimiento con Lighthouse", () => {

    it('Reporte Lighthouse para Desktop', () => {
        const desktopConfig = `--preset=desktop`; 

        const lighthouseConfigDesktop = {
            configPath: desktopConfig,
            onlyCategories: ['performance'],
            disableStorageReset: true
        };

        const thresholdsDesktop = {
            performance: 60,
            "first-contentful-paint": 1800,
            "largest-contentful-paint": 2500,
            "total-blocking-time": 200,
            "cumulative-layout-shift": 0.1,
            "speed-index": 3400,
        };

        const outputPath = './cypress/fixtures/lighthouse-desktop-reporte.json';

        cy.task('runLighthouse', {
            url: `${Cypress.config("baseUrl")}`,
            outputPath,
            thresholds: thresholdsDesktop,
            config: lighthouseConfigDesktop
        }).then((message) => {
            cy.log(message);

            cy.readFile(outputPath).then((report) => {
                expect(report).to.have.property('categories');
                cy.log('Reporte Desktop leído correctamente:', JSON.stringify(report));
            });
        });
    });


    it('Reporte Lighthouse para Mobile', () => {
        const mobileConfig = `--form-factor=mobile --screenEmulation.width=275 --screenEmulation.height=667 --screenEmulation.deviceScaleFactor=3 --screenEmulation.mobile=true`;
        const lighthouseConfigMobile = {
            formFactor: 'mobile',
            screenEmulation: {
                mobile: true,
                width: 275,
                height: 567,
                deviceScaleFactor: 3,
            },
            onlyCategories: ['performance']
        };

        const thresholdsMobile = {
            performance: 50,
            "first-contentful-paint": 3000,
            "largest-contentful-paint": 4000,
            "total-blocking-time": 600,
            "cumulative-layout-shift": 0.25,
            "speed-index": 5800,
        };

        const outputPath = './cypress/fixtures/lighthouse-mobile-reporte.json';

        cy.task('runLighthouse', {
            url: `${Cypress.config("baseUrl")}`,
            outputPath,
            thresholds: thresholdsMobile,
            config: lighthouseConfigMobile
        }).then((message) => {
            cy.log(message);

            cy.readFile(outputPath).then((report) => {
                expect(report).to.have.property('categories');
                cy.log('Reporte Mobile leído correctamente:', JSON.stringify(report));
            });
        });
    });
});

