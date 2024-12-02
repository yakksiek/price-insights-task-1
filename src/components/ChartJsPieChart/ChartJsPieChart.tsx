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
import { PieChartType } from '../../features/Statistics/types/types';

const chartSettings = {
    OUTER_RADIUS_BLUE: 90,
    OUTER_RADIUS_ORANGE: 83,
    INNER_RADIUS_GENERAL: 64,
    DATA_SET_NAME: 'primary',
    GREY_BACKGROUND_COLOR: 'rgba(238, 238, 242,1)',
};

const CHART_SLICES_THICKNESS_SETTINGS = [
    // orange
    [chartSettings.INNER_RADIUS_GENERAL, chartSettings.OUTER_RADIUS_ORANGE],
    // blue
    [chartSettings.INNER_RADIUS_GENERAL, chartSettings.OUTER_RADIUS_BLUE],
];

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
        const datasetPrimary = chart.data.datasets.find(dataset => dataset.label === chartSettings.DATA_SET_NAME);

        if (Array.isArray(datasetPrimary?.backgroundColor)) {
            const blueSegmentIndex = 1; // Index of the blue slice
            const orangeSegmentIndex = 0; // Index of the orange slice

            // Replace plain colors with gradients
            datasetPrimary.backgroundColor[blueSegmentIndex] = primaryGradient;
            datasetPrimary.backgroundColor[orangeSegmentIndex] = secondaryGradient;
        }

        chart.$gradientApplied = true; // Set flag to avoid redundant updates
        chart.update();
    },
};

const shadowPlugin = {
    id: 'shadow',
    afterDatasetsDraw(chart: Chart<'pie' | 'doughnut'>) {
        const ctx = chart.ctx;

        const shadowColors = chart.options.plugins?.shadowColors;
        if (!shadowColors) return;
        const primaryShadowColors = shadowColors.primary;

        const datasetPrimary = chart.data.datasets.find(dataset => dataset.label === chartSettings.DATA_SET_NAME);
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
        ctx.fillStyle = chartSettings.GREY_BACKGROUND_COLOR; // The grey background color
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
        const innerRadius = backgroundOptions.innerRadius ?? chartSettings.INNER_RADIUS_GENERAL + 1;
        const innerColor = backgroundOptions.innerColor ?? chartSettings.GREY_BACKGROUND_COLOR;

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
    id: PieChartType;
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
    value: number;
    primaryValueHandler: () => void;
    secondaryValueHandler: () => void;
}

function ChartJsPieChart({
    chartData,
    coveredState,
    notCoveredState,
    value,
    primaryValueHandler,
    secondaryValueHandler,
}: PieChartProps) {
    const { primaryColor, primaryGradientColors, secondaryColor, secondaryGradientColors, primaryColorShadow } =
        chartData;

    const primarySliceColor = coveredState ? primaryColor : 'transparent';
    const primaryBorderColor = coveredState ? 'rgba(246, 246, 248, 1)' : '';
    const primaryBorderThickness = coveredState ? 1 : 0;
    const secondarySliceColor = notCoveredState ? secondaryColor : 'transparent';
    const secondaryBorderColor = notCoveredState ? 'rgba(246, 246, 248, 1)' : '';
    const secondaryBorderThickness = notCoveredState ? 1 : 0;
    const dataToRender = !coveredState ? 0 : !notCoveredState ? 100 : value;

    const handleSliceClick = (sliceIndex: number, datasetLabel: string | undefined) => {
        console.log(`Clicked slice in '${datasetLabel}' dataset at index ${sliceIndex}`);

        if (sliceIndex === 0) {
            secondaryValueHandler();
        }

        if (sliceIndex === 1) {
            primaryValueHandler();
        }
    };

    const data = {
        labels: [],
        datasets: [
            {
                label: chartSettings.DATA_SET_NAME,
                data: [100 - dataToRender, dataToRender],
                backgroundColor: [secondarySliceColor, primarySliceColor],
                borderColor: [secondaryBorderColor, primaryBorderColor],
                borderWidth: [secondaryBorderThickness, primaryBorderThickness],
                borderRadius: 2,
            },
        ],
    };

    const options = {
        // cutout: '50%',
        spacing: 0.5,
        plugins: {
            tooltip: {
                enabled: false,
            },
            thickness: {
                // manually setting thickness for each pie slice
                thickness: CHART_SLICES_THICKNESS_SETTINGS,
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
        onClick: (_event: ChartEvent, elements: ActiveElement[], chart: Chart) => {
            if (elements.length === 0) return;

            // Get the dataset label and clicked element index
            const clickedElementIndex = elements[0].index;
            const datasetIndex = elements[0].datasetIndex;
            const datasetLabel = chart.data.datasets[datasetIndex]?.label;

            // Only process clicks on the 'primary' dataset
            if (datasetLabel === chartSettings.DATA_SET_NAME) {
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
