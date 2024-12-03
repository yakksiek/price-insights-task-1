import { FC } from 'react';
import { ActiveElement, ArcElement, Chart, ChartEvent, Chart as ChartJS, ChartType, Legend, Tooltip } from 'chart.js';
import { Doughnut } from 'react-chartjs-2';
import * as S from './styled';
import { IChartData, IGradientColorsOptions, IShadowColorsOptions, IThicknessPluginOptions } from './types';
import { thicknessPlugin, innerTextPlugin, gradientPlugin, shadowPlugin, backgroundPlugin } from './plugins';
import { CHART_SETTINGS } from './constants';

// order of colors is important
const CHART_SLICES_THICKNESS_SETTINGS = [
    // orange
    [CHART_SETTINGS.INNER_RADIUS_GENERAL, CHART_SETTINGS.OUTER_RADIUS_ORANGE],
    // blue
    [CHART_SETTINGS.INNER_RADIUS_GENERAL, CHART_SETTINGS.OUTER_RADIUS_BLUE],
];

declare module 'chart.js' {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    interface PluginOptionsByType<TType extends ChartType> {
        thickness?: IThicknessPluginOptions;
        gradientColors?: IGradientColorsOptions;
        shadowColors?: IShadowColorsOptions;
        text?: string;
    }

    interface Chart {
        $gradientApplied?: boolean; // Custom property to track gradient application
    }
}

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

interface IProps {
    chartData: IChartData;
    coveredState: boolean;
    notCoveredState: boolean;
    value: number;
    primaryValueHandler: () => void;
    secondaryValueHandler: () => void;
}

export const PieChart: FC<IProps> = ({
    chartData,
    coveredState,
    notCoveredState,
    value,
    primaryValueHandler,
    secondaryValueHandler,
}) => {
    const { primaryColor, primaryGradientColors, secondaryColor, secondaryGradientColors, primaryColorShadow } =
        chartData;

    // to refactor once final decision on logic made
    const primarySliceColor = coveredState ? primaryColor : 'transparent';
    const primaryBorderColor = coveredState ? CHART_SETTINGS.GREY_BACKGROUND_COLOR : '';
    const primaryBorderThickness = coveredState ? 1 : 0;
    const secondarySliceColor = notCoveredState ? secondaryColor : 'transparent';
    const secondaryBorderColor = notCoveredState ? CHART_SETTINGS.GREY_BACKGROUND_COLOR : '';
    const secondaryBorderThickness = notCoveredState ? 1 : 0;
    const dataToRender = !coveredState ? 0 : !notCoveredState ? 100 : value;

    const handleSliceClick = (sliceIndex: number) => {
        // CASE 1
        // when BOTH slices are active
        // a click on blue turns off orange

        // CASE 2
        // when ONLY one slice is active
        // then the active slice becomes index 0
        // and by click on it, it restores state to both active
        const isSecondarySliceClicked = sliceIndex === 0; // orange slice
        if (isSecondarySliceClicked) {
            primaryValueHandler();
        }

        const isPrimarySliceClicked = sliceIndex === 1; // blue slice
        if (isPrimarySliceClicked) {
            secondaryValueHandler();
        }
    };

    const data = {
        labels: [],
        datasets: [
            {
                label: CHART_SETTINGS.DATA_SET_NAME,
                data: [100 - dataToRender, dataToRender],
                backgroundColor: [secondarySliceColor, primarySliceColor],
                borderColor: [secondaryBorderColor, primaryBorderColor],
                borderWidth: [secondaryBorderThickness, primaryBorderThickness],
                borderRadius: 2,
            },
        ],
    };

    const options = {
        spacing: 0.5,
        onHover: (event: ChartEvent, elements: ActiveElement[]) => {
            const chartCanvas = event.native?.target as HTMLCanvasElement;
            if (!chartCanvas) return;

            chartCanvas.style.cursor = elements.length ? 'pointer' : 'default';
        },
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
        onClick: (_event: ChartEvent, elements: ActiveElement[], chart: Chart) => {
            if (elements.length === 0) return;

            // Get the dataset label and clicked element index
            const clickedElementIndex = elements[0].index;
            const datasetIndex = elements[0].datasetIndex;
            const datasetLabel = chart.data.datasets[datasetIndex]?.label;

            // Only process clicks on the 'primary' dataset
            if (datasetLabel === CHART_SETTINGS.DATA_SET_NAME) {
                handleSliceClick(clickedElementIndex);
            }
        },
    };

    return (
        <S.StyledChartWrapper>
            <Doughnut data={data} options={options} />
        </S.StyledChartWrapper>
    );
};
