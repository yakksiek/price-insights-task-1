import { ArcElement, Chart, Chart as ChartJS, ChartType, Legend, Plugin, Tooltip } from 'chart.js';
import { Doughnut } from 'react-chartjs-2';
import styled from 'styled-components';

// THINGS TO CONSIDER:
// 1. general spacing/gap cannot be applied accross all slices as grey fill
// in the middle of pie won't form closed circle, that's why orange and blue slices have manual dividers
// 2. Since 'labels' are not used visually, they are leveraged as IDs to find datasets in plugins,
// avoiding the need to manually specify indexes.
// 3. changing the size of chart creates a shift in colors because of the gradient fill, so I had to alter a bit original gradient colors
// 4. should plugins be kept in a seperate file?

const StyledChartWrapper = styled.div`
    display: flex;
    align-items: center;
    justify-content: center;
`;

interface ThicknessPluginOptions {
    thickness: Array<[number, number]>;
}

interface GradientColorsOptions {
    primary: [string, string];
    secondary: [string, string];
}

interface ShadowColorsOptions {
    primary: string;
}

declare module 'chart.js' {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    interface PluginOptionsByType<TType extends ChartType> {
        thickness?: ThicknessPluginOptions;
        gradientColors?: GradientColorsOptions;
        shadowColors?: ShadowColorsOptions;
        text?: string;
    }

    interface Chart {
        $gradientApplied?: boolean; // Custom property to track gradient application
    }
}

const thicknessPlugin: Plugin<'pie' | 'doughnut'> = {
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

const innerTextPlugin: Plugin<'pie' | 'doughnut'> = {
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
            fontFamily: 'sans-serif',
        };

        const setFontStyle = (fontSize: number) => {
            ctx.font = `${fontSize}em ${styles.fontFamily}`;
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
        ctx.fillText('%', centerX + mainValueWidth, centerY);

        ctx.save();
    },
};

const gradientPlugin: Plugin<'pie' | 'doughnut'> = {
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
        primaryGradient.addColorStop(1, primaryGradientColors[1]);

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
        secondaryGradient.addColorStop(1, secondaryGradientColors[1]);

        // Apply gradients to the respective segments
        const datasetBlue = chart.data.datasets.find(dataset => dataset.label === 'primary');
        const datasetOrange = chart.data.datasets.find(dataset => dataset.label === 'secondary');

        if (Array.isArray(datasetBlue?.backgroundColor) && Array.isArray(datasetOrange?.backgroundColor)) {
            const blueSegmentIndex = 2; // Index of the blue slice
            const orangeSegmentIndex = 0; // Index of the orange slice

            // Replace plain colors with gradients
            datasetBlue.backgroundColor[blueSegmentIndex] = primaryGradient;
            datasetOrange.backgroundColor[orangeSegmentIndex] = secondaryGradient;
        }

        chart.$gradientApplied = true; // Set flag to avoid redundant updates
        // Triggering chart update so it applies immediately
        // without it only on some action with chart the gradient applies
        chart.update();
    },
};

const shadowPlugin = {
    id: 'shadow',
    afterDatasetsDraw(chart: Chart<'pie' | 'doughnut'>) {
        const ctx = chart.ctx;

        const shadowColors = chart.options.plugins?.shadowColors;
        if (!shadowColors) return;
        const primaryShadowColors = shadowColors.primary as string;

        const datasetPrimary = chart.data.datasets.find(dataset => dataset.label === 'primary');
        if (!datasetPrimary) return;
        const datasetPrimaryIndex = chart.data.datasets.indexOf(datasetPrimary);
        const blueSegmentIndex = 2; // Index of the blue slice within the dataset

        const meta = chart.getDatasetMeta(datasetPrimaryIndex);
        if (meta && meta.data) {
            const arc = meta.data[blueSegmentIndex] as ArcElement;

            // Save the original draw method
            const originalDraw = arc.draw;

            // Override the draw method
            arc.draw = function (...args) {
                ctx.save();
                ctx.shadowColor = primaryShadowColors;
                ctx.shadowBlur = 25;
                ctx.shadowOffsetX = 0;
                ctx.shadowOffsetY = 0;

                // Draw the arc
                originalDraw.apply(this, args);

                ctx.restore();
            };
        }
    },
};

ChartJS.register(ArcElement, Tooltip, Legend, thicknessPlugin, innerTextPlugin, gradientPlugin, shadowPlugin);

export interface ChartData {
    primaryData: number;
    primaryColor: string;
    primaryGradientColors: [string, string];
    primaryColorShadow: string;
    secondaryColor: string;
    secondaryGradientColors: [string, string];
}

interface PieChartProps {
    chartData: ChartData;
}

function ChartJsPieChart({ chartData }: PieChartProps) {
    const {
        primaryData,
        primaryColor,
        primaryGradientColors,
        secondaryColor,
        secondaryGradientColors,
        primaryColorShadow,
    } = chartData;

    const data = {
        labels: [],
        datasets: [
            {
                // dummy dataset to fill middle.
                label: 'inner',
                data: [1],
                backgroundColor: 'rgba(235, 235, 242,1',
                weight: 3,
                borderWidth: 0,
            },
            {
                label: 'primary',
                data: [100 - primaryData, 0.25, primaryData, 0.25],
                backgroundColor: ['transparent', 'transparent', primaryColor, 'transparent'],
                borderColor: ['', '', 'rgba(246, 246, 248, 1)', ''],
                borderWidth: [0, 0, 1, 0],
                borderRadius: 2,
            },
            {
                label: 'secondary',
                data: [100 - primaryData, 0.25, primaryData, 0.25],
                backgroundColor: [secondaryColor, 'transparent', 'transparent', 'transparent'],
                borderColor: ['rgba(246, 246, 248, 1)', '', '', ''],
                borderWidth: [1, 0, 0, 0],
                borderRadius: 2,
            },
            {
                label: 'grey background',
                data: [100],
                backgroundColor: ['rgba(238, 238, 242,1)'],
                borderColor: [''],
                borderWidth: [0],
            },
        ],
    };

    const options = {
        cutout: '50%',
        plugins: {
            tooltip: {
                enabled: false,
            },
            thickness: {
                // manually setting thickness for each pie slice
                thickness: [
                    [0, 66], // grey circle inside
                    [65, 90], // Blue segment - blue slice
                    [65, 90], // Blue segment - manual gap
                    [65, 90], // Blue segment - transparent orange
                    [65, 90], // Blue segment - manual gap
                    [65, 83], // Orange segment - transparent blue
                    [65, 83], // Orange segment - manual gap
                    [65, 83], // Orange segment - oragne slice
                    [65, 83], // Orange segment - manual gap
                    [65, 90], // grey background for thinner slice
                ],
            },
            gradientColors: {
                primary: primaryGradientColors,
                secondary: secondaryGradientColors,
            },
            shadowColors: {
                primary: primaryColorShadow,
            },
            text: primaryData.toString(),
        },
        events: [],
        animation: {
            duration: 0, // Disable all animations, including hover
        },
    };

    return (
        <StyledChartWrapper style={{ width: '215px', height: '215px' }}>
            <Doughnut data={data} options={options} />
        </StyledChartWrapper>
    );
}

export default ChartJsPieChart;
