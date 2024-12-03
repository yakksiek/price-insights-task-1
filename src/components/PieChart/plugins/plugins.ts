import { ArcElement, Chart, Plugin } from 'chart.js';
import { CHART_SETTINGS } from '../constants';

export const thicknessPlugin: Plugin<'pie' | 'doughnut'> = {
    id: 'thickness',
    beforeDraw(chart) {
        // Get the thickness configuration from the chart options
        const thickness = chart.options.plugins?.thickness?.thickness || [];

        if (!thickness.length) return; // Exit early if no thickness data

        let sliceIndex = 0;
        // Loop through datasets and their arcs
        chart.data.datasets.forEach((_, datasetIndex) => {
            const meta = chart.getDatasetMeta(datasetIndex);

            // Check if the dataset has arcs
            if (meta && meta.data) {
                (meta.data as ArcElement[]).forEach(arc => {
                    // Ensure we don't exceed the thickness array
                    if (sliceIndex < thickness.length) {
                        const [innerRadius, outerRadius] = thickness[sliceIndex] || [];

                        // Apply thickness if defined
                        if (typeof innerRadius === 'number' && typeof outerRadius === 'number') {
                            arc.innerRadius = innerRadius;
                            arc.outerRadius = outerRadius;
                        }

                        sliceIndex++; // Increment global slice index
                    }
                });
            }
        });
    },
};

export const innerTextPlugin: Plugin<'pie' | 'doughnut'> = {
    id: 'text',
    afterDraw: function (chart) {
        // Retrieve the custom text from plugin options
        const text = chart.options.plugins?.text || '';
        if (!text) return;

        const { width, height, ctx } = chart;

        ctx.restore();

        const styles = {
            mainFontSize: 2,
            percentFontSize: 1,
            fontFamily: 'system-ui',
            fontWeight: 300,
        };

        const setFontStyle = (fontSize: number) => {
            ctx.font = `${styles.fontWeight} ${fontSize}em ${styles.fontFamily}`;
        };

        setFontStyle(styles.mainFontSize);
        const mainValueWidth = ctx.measureText(text).width;

        setFontStyle(styles.percentFontSize);
        const percentSignWidth = ctx.measureText('%').width;

        const totalWidth = mainValueWidth + percentSignWidth;
        const centerX = Math.round((width - totalWidth) / 2);
        const centerY = height / 2;

        setFontStyle(styles.mainFontSize);
        ctx.textBaseline = 'middle';
        ctx.fillText(text, centerX, centerY);

        setFontStyle(styles.percentFontSize);
        ctx.fillText(' %', centerX + mainValueWidth, centerY);

        ctx.save();
    },
};

export const gradientPlugin: Plugin<'pie' | 'doughnut'> = {
    id: 'gradient',
    beforeDraw(chart) {
        // Avoid redundant updates
        // without this an error appears with maximum call stack size exceeded
        if (chart.$gradientApplied) return;

        const ctx = chart.ctx;
        const chartArea = chart.chartArea;

        const xCenter = (chartArea.left + chartArea.right) / 2;
        const yCenter = (chartArea.top + chartArea.bottom) / 2;
        const innerRadius = 0;
        const outerRadius = (chartArea.right - chartArea.left) / 2;

        // Access gradient colors from chart options
        const gradientColors = chart.options.plugins?.gradientColors;
        if (!gradientColors) return;

        // Gradient for the blue slice
        const primaryGradientColors = gradientColors.primary as [string, string];
        const primaryGradient = ctx.createRadialGradient(xCenter, yCenter, innerRadius, xCenter, yCenter, outerRadius);
        primaryGradient.addColorStop(0, primaryGradientColors[0]);
        primaryGradient.addColorStop(0.7, primaryGradientColors[1]);

        // Gradient for the orange slice
        const secondaryGradientColors = gradientColors.secondary as [string, string];
        const secondaryGradient = ctx.createRadialGradient(
            xCenter,
            yCenter,
            innerRadius,
            xCenter,
            yCenter,
            outerRadius,
        );
        secondaryGradient.addColorStop(0, secondaryGradientColors[0]);
        secondaryGradient.addColorStop(0.7, secondaryGradientColors[1]);

        // Apply gradients to the respective segments
        const datasetPrimary = chart.data.datasets.find(dataset => dataset.label === CHART_SETTINGS.DATA_SET_NAME);

        if (Array.isArray(datasetPrimary?.backgroundColor)) {
            const primarySegmentIndex = 1; // Index of the blue slice
            const secondarySegmentIndex = 0; // Index of the orange slice

            // Replace plain colors with gradients
            datasetPrimary.backgroundColor[primarySegmentIndex] = primaryGradient;
            datasetPrimary.backgroundColor[secondarySegmentIndex] = secondaryGradient;
        }

        chart.$gradientApplied = true; // Set flag to avoid redundant updates
        chart.update();
    },
};

export const shadowPlugin = {
    id: 'shadow',
    afterDatasetsDraw(chart: Chart<'pie' | 'doughnut'>) {
        const ctx = chart.ctx;

        const shadowColors = chart.options.plugins?.shadowColors;
        if (!shadowColors) return;
        const primaryShadowColors = shadowColors.primary;

        const datasetPrimary = chart.data.datasets.find(dataset => dataset.label === CHART_SETTINGS.DATA_SET_NAME);
        if (!datasetPrimary) return;
        const datasetPrimaryIndex = chart.data.datasets.indexOf(datasetPrimary);
        const primarySegmentIndex = 1; // Index of the blue slice within the dataset

        const meta = chart.getDatasetMeta(datasetPrimaryIndex);
        if (meta && meta.data) {
            const arc = meta.data[primarySegmentIndex] as ArcElement;

            // Save the original draw method
            const originalDraw = arc.draw;

            // Override the draw method
            arc.draw = function (...args) {
                ctx.save();
                ctx.shadowColor = primaryShadowColors || 'rgba(87, 137, 213, 0.787)';
                ctx.shadowBlur = 35;
                ctx.shadowOffsetX = 0;
                ctx.shadowOffsetY = 0;

                // Draw the arc
                originalDraw.apply(this, args);

                ctx.restore();
            };
        }
    },
};

export const backgroundPlugin: Plugin<'pie' | 'doughnut'> = {
    id: 'background',
    beforeDatasetsDraw(chart) {
        const { ctx, chartArea } = chart;
        const xCenter = (chartArea.left + chartArea.right) / 2;
        const yCenter = (chartArea.top + chartArea.bottom) / 2;

        // Use the outermost radius from your thickness settings
        const outerRadius = CHART_SETTINGS.OUTER_RADIUS_BLUE; // Adjust this value to match your outermost arc's outerRadius

        ctx.save();
        ctx.beginPath();
        ctx.arc(xCenter, yCenter, outerRadius, 0, 2 * Math.PI);
        ctx.fillStyle = CHART_SETTINGS.GREY_BACKGROUND_COLOR; // The grey background color
        ctx.fill();
        ctx.restore();
    },
    afterDatasetsDraw(chart, _, options) {
        // Drawing the inner fill circle on top of the datasets
        const { ctx, chartArea } = chart;
        const xCenter = (chartArea.left + chartArea.right) / 2;
        const yCenter = (chartArea.top + chartArea.bottom) / 2;

        const backgroundOptions = options.plugins?.background ?? {};
        // + 1 to cover the inner white border of the slices
        const innerRadius = backgroundOptions.innerRadius ?? CHART_SETTINGS.INNER_RADIUS_GENERAL + 1;
        const innerColor = backgroundOptions.innerColor ?? CHART_SETTINGS.GREY_BACKGROUND_COLOR;

        ctx.save();
        ctx.beginPath();
        ctx.arc(xCenter, yCenter, innerRadius, 0, 2 * Math.PI);
        ctx.fillStyle = innerColor;
        ctx.fill();
        ctx.restore();
    },
};
