describe('Prueba de rendimiento', () => {


    beforeEach(() => {
        cy.visit("/");
    })

    const customThresholds = {
        performance: 90,
        "first-contentful-paint": 1800,
        "largest-contentful-paint": 2500,
        "total-blocking-time": 200,
        "cumulative-layout-shift": 0.1,
        "speed-index": 3400,
    };

    const desktopConfig = {
        formFactor: "desktop",
        screenEmulation: {
            width: 1350,
            height: 940,
            deviceScaleRatio: 1,
            mobile: false,
            disable: false,
        },
        throttling: {
            rttMs: 40,
            throughputKbps: 11024,
            cpuSlowdownMultiplier: 1,
            requestLatencyMs: 0,
            downloadThroughputKbps: 0,
            uploadThroughputKbps: 0,
        },
    };

    const mobileConfig = {
        formFactor: "mobile",
        screenEmulation: {
            width: 375,
            height: 767,
            deviceScaleRatio: 1,
            mobile: true,
            disable: false,
        },
        throttling: {
            rttMs: 150,
            throughputKbps: 1500,
            cpuSlowdownMultiplier: 4,
            requestLatencyMs: 0,
            downloadThroughputKbps: 0,
            uploadThroughputKbps: 0,
        },
    };

    it('Reporte Lighthouse para Desktop y Móvil', () => {
        // Desktop Report
        cy.lighthouse(customThresholds,desktopConfig).then((desktopReport) => {
            cy.log(desktopReport);
        });

        // Mobile Report
        cy.lighthouse(customThresholds,mobileConfig).then((mobileReport) => {
            cy.log(mobileReport);
        });

    
    });
});
