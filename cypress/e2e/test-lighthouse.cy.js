describe('Prueba de rendimiento', () => {


    beforeEach(() => {
        cy.visit("/");
    })

    it('Reporte Lighthouse para Desktop', () => {
        const thresholdsDesktop = {
            performance: 90,
            "first-contentful-paint": 2500,
            "largest-contentful-paint": 4000,
            "total-blocking-time": 200,
            "cumulative-layout-shift": 0.1,
            "speed-index": 4000,
        };

        const configDesktop = {
            formFactor: 'desktop',
            screenEmulation: {
                mobile: false,
                width: 1920,
                height: 1080,
                deviceScaleFactor: 1,
                disabled: false,
            },
            onlyCategories: ['performance'],
        };

        cy.task('lighthouse', {
            url: `${Cypress.config("baseUrl")}`,
            thresholds: thresholdsDesktop,
            configThresholds: configDesktop
        }).then((respuesta) => {
            if (!respuesta) {
                throw new Error('No se recibieron resultados de Lighthouse');
            }
           
            const resp = formatoResultado(respuesta);
            cy.log('Resultados de Lighthouse para Desktop:', JSON.stringify(resp));
            cy.writeFile('./cypress/fixtures/lighthouse-desktop-reporte.json', resp);
        });
    });

    
    it('Reporte Lighthouse para Mobile', () => {
        const thresholdsMobile = {
            performance: 30,
            "first-contentful-paint": 3500,
            "largest-contentful-paint": 4000,
            "total-blocking-time": 300,
            "cumulative-layout-shift": 0.2,
            "speed-index": 10000,
        };

        const configMobile = {
            formFactor: 'mobile',
            screenEmulation: {
                mobile: true,
                width: 375,
                height: 667,
                deviceScaleFactor: 3,
                disabled: false,
            },
            onlyCategories: ['performance'],
        };

        cy.task('lighthouse',{
            url: `${Cypress.config("baseUrl")}`,
            thresholds: thresholdsMobile, 
            configThresholds: configMobile
        }).then((respuesta) => {
            cy.log(respuesta);
            if (!respuesta) {
                throw new Error('No se recibieron resultados de Lighthouse');
            }

            const resp = formatoResultado(respuesta);
            cy.log('Resultados de Lighthouse para Mobile:', JSON.stringify(resp));
            cy.writeFile('./cypress/fixtures/lighthouse-mobile-reporte.json', resp);
        });
    });
});

/** 
 * Prepara la forma de presentar el informe: 
 * fecha: fecha de la prueba, 
 * errors: el resultado de las métricas no son las esperadas,
 * result: el resultado de las métricas son las esperadas
*/
function formatoResultado(respuestaLighthouse) {
    const fecha = new Date().toISOString();
    const resultadoConFecha = {
        fecha_prueba: fecha,
        resultados: respuestaLighthouse
    };
    return resultadoConFecha;
}

