import { ArcElement, Chart, Chart as ChartJS, ChartType, Legend, Plugin, Tooltip } from 'chart.js';
import { Doughnut } from 'react-chartjs-2';

// THINGS TO CONSIDER:
// 1. general spacing/gap cannot be applied accross all slices as grey fill
// in the middle of pie won't form closed circle, that's why orange and blue slices have manual dividers
// 2. Since 'labels' are not used visually, they are leveraged as IDs to find datasets in plugins,
// avoiding the need to manually specify indexes.
// 3. changing the size of chart creating a shift in colors

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
        const text = chart.options.plugins?.text || ''; // Access text from plugin options
        if (!text) return;

        const width = chart.width;
        const height = chart.height;
        const ctx = chart.ctx;

        ctx.restore();

        // Define font sizes for the main value and the percentage sign
        const mainFontSize = 2; // Font size for the main value
        const percentFontSize = 1; // Font size for the percentage sign

        // Main value
        ctx.font = `${mainFontSize}em sans-serif`;
        ctx.textBaseline = 'middle';
        const mainValueWidth = ctx.measureText(text).width;

        // Percentage sign ("%")
        ctx.font = `${percentFontSize}em sans-serif`;
        const percentSignWidth = ctx.measureText('%').width;

        // Calculate total width and center positions
        const totalWidth = mainValueWidth + percentSignWidth;
        const textX = Math.round((width - totalWidth) / 2); // Center align
        const textY = height / 2;

        // Draw the main value
        ctx.font = `${mainFontSize}em sans-serif`;
        ctx.fillText(text, textX, textY);

        // Draw the percentage sign
        ctx.font = `${percentFontSize}em sans-serif`;
        ctx.fillText('%', textX + mainValueWidth, textY);

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

        // Calculate the center and size of the gradient
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
        chart.update(); // Triggering chart update so it applies immediately
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

        // const datasetIndex = 1; // Index of the dataset containing the blue slice
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
                borderColor: ['', '', 'white', ''],
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
                thickness: [
                    [0, 51], // grey circle inside
                    [30, 70], // Blue segment - blue slice
                    [30, 70], // Blue segment - manual gap
                    [30, 70], // Blue segment - transparent orange
                    [30, 70], // Blue segment - manual gap
                    [30, 65], // Orange segment - transparent blue
                    [30, 65], // Orange segment - manual gap
                    [30, 65], // Orange segment - oragne slice
                    [30, 65], // Orange segment - manual gap
                    [50, 70], // grey background for thinner slice
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
        layout: {
            padding: 2,
        },
        events: [],
        animation: {
            duration: 0, // Disable all animations, including hover
        },
    };

    return (
        <div style={{ width: '182px', height: '182px' }}>
            <Doughnut data={data} options={options} />
        </div>
    );
}

export default ChartJsPieChart;
