import {
    ActiveElement,
    ArcElement,
    Chart,
    ChartEvent,
    Chart as ChartJS,
    ChartType,
    Legend,
    Plugin,
    Tooltip,
} from 'chart.js';
import { Doughnut } from 'react-chartjs-2';
import styled from 'styled-components';

const StyledChartWrapper = styled.div`
    display: flex;
    justify-content: center;
    width: 250px;
    height: 250px;
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
            fontFamily: 'system-ui',
        };

        const setFontStyle = (fontSize: number) => {
            ctx.font = `300 ${fontSize}em ${styles.fontFamily}`;
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
        primaryGradient.addColorStop(0.04, primaryGradientColors[0]);
        primaryGradient.addColorStop(0.6, primaryGradientColors[1]);

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
        const blueSegmentIndex = 1; // Index of the blue slice within the dataset

        const meta = chart.getDatasetMeta(datasetPrimaryIndex);
        if (meta && meta.data) {
            const arc = meta.data[blueSegmentIndex] as ArcElement;

            // Save the original draw method
            const originalDraw = arc.draw;

            // Override the draw method
            arc.draw = function (...args) {
                ctx.save();
                ctx.shadowColor = primaryShadowColors;
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

const backgroundPlugin: Plugin<'pie' | 'doughnut'> = {
    id: 'background',
    beforeDatasetsDraw(chart) {
        const { ctx, chartArea } = chart;
        const xCenter = (chartArea.left + chartArea.right) / 2;
        const yCenter = (chartArea.top + chartArea.bottom) / 2;

        // Use the outermost radius from your thickness settings
        const outerRadius = 90; // Adjust this value to match your outermost arc's outerRadius

        ctx.save();
        ctx.beginPath();
        ctx.arc(xCenter, yCenter, outerRadius, 0, 2 * Math.PI);
        ctx.fillStyle = 'rgba(238, 238, 242,1)'; // The grey background color
        ctx.fill();
        ctx.restore();
    },
    afterDatasetsDraw(chart, _, options) {
        // Drawing the inner circle on top of the datasets
        const { ctx, chartArea } = chart;
        const xCenter = (chartArea.left + chartArea.right) / 2;
        const yCenter = (chartArea.top + chartArea.bottom) / 2;

        const backgroundOptions = options.plugins?.background ?? {};
        const innerRadius = backgroundOptions.innerRadius ?? 65;
        const innerColor = backgroundOptions.innerColor ?? 'rgba(235, 235, 242,1)';

        ctx.save();
        ctx.beginPath();
        ctx.arc(xCenter, yCenter, innerRadius, 0, 2 * Math.PI);
        ctx.fillStyle = innerColor;
        ctx.fill();
        ctx.restore();
    },
};

ChartJS.register(
    ArcElement,
    Tooltip,
    Legend,
    thicknessPlugin,
    innerTextPlugin,
    gradientPlugin,
    shadowPlugin,
    backgroundPlugin,
);

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
    coveredState: boolean;
    notCoveredState: boolean;
}

function ChartJsPieChart({ chartData, coveredState, notCoveredState }: PieChartProps) {
    const {
        primaryData,
        primaryColor,
        primaryGradientColors,
        secondaryColor,
        secondaryGradientColors,
        primaryColorShadow,
    } = chartData;

    const primarySliceColor = coveredState ? primaryColor : 'transparent';
    const primaryBorderColor = coveredState ? 'rgba(246, 246, 248, 1)' : '';
    const primaryBorderThickness = coveredState ? 1 : 0;
    const secondarySliceColor = notCoveredState ? secondaryColor : 'transparent';
    const secondaryBorderColor = notCoveredState ? 'rgba(246, 246, 248, 1)' : '';
    const secondaryBorderThickness = notCoveredState ? 1 : 0;
    const dataToRender = coveredState ? primaryData : 0;

    const handleSliceClick = (sliceIndex: number, datasetLabel: string | undefined) => {
        console.log(`Clicked slice in '${datasetLabel}' dataset at index ${sliceIndex}`);
    };

    const data = {
        labels: [],
        datasets: [
            {
                label: 'primary',
                data: [100 - dataToRender, dataToRender],
                backgroundColor: [secondarySliceColor, primarySliceColor],
                borderColor: [secondaryBorderColor, primaryBorderColor],
                borderWidth: [secondaryBorderThickness, primaryBorderThickness],
                borderRadius: 2,
            },
        ],
    };

    const options = {
        cutout: '50%',
        spacing: 0.5,
        plugins: {
            tooltip: {
                enabled: false,
            },
            thickness: {
                // manually setting thickness for each pie slice
                thickness: [
                    [64, 83], // Orange segment - manual gap
                    [64, 90], // Blue segment - blue slice
                ],
            },
            gradientColors: {
                primary: primaryGradientColors,
                secondary: secondaryGradientColors,
            },
            shadowColors: {
                primary: primaryColorShadow,
            },
            text: dataToRender.toString(),
        },
        events: ['click' as const],
        onClick: (event: ChartEvent, elements: ActiveElement[], chart: Chart) => {
            if (elements.length === 0) return;

            // Get the dataset label and clicked element index
            const clickedElementIndex = elements[0].index;
            const datasetIndex = elements[0].datasetIndex;
            const datasetLabel = chart.data.datasets[datasetIndex]?.label;

            // Only process clicks on the 'primary' dataset
            if (datasetLabel === 'secondary' || datasetLabel === 'primary') {
                handleSliceClick(clickedElementIndex, datasetLabel);
            } else {
                console.log('Click ignored for dataset:', datasetLabel);
            }
        },
    };

    return (
        <StyledChartWrapper>
            <Doughnut data={data} options={options} />
        </StyledChartWrapper>
    );
}

export default ChartJsPieChart;
