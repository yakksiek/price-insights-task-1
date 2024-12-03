import { Config, PieData } from 'plotly.js';
import Plot from 'react-plotly.js';
import styled, { css } from 'styled-components';
import { getCssVariable } from '../../../utils';
import * as t from '../../../types';

// PROBLEMS & QUESTIONABLE CHOICES
// 1. no gradient on color slices
// 2. no outer white border on blue slice (visible in Figma layout not on a printscreen provided)
// 3. not programmatically calculated the layered orange color blow blue
// 4. drop-shadow not working on safari

interface StyledWrapperProps {
    $primaryColor: string;
    $colorScheme: t.ColorScheme;
}

const StyledWrapper = styled.div<StyledWrapperProps>`
    .slice path.surface[style*='fill: ${({ $primaryColor }) => $primaryColor}'] {
        filter: drop-shadow(0 0 4px var(--blue-drop-shadow));

        ${({ $colorScheme }) =>
            $colorScheme === 'purple' &&
            css`
                filter: drop-shadow(0 0 5px var(--purple-drop-shadow));
            `}
    }
`;

interface PlotlyPieChartProps {
    chartConfig: t.PlotlyChartConfig;
}

function PlotlyPieChart({ chartConfig }: PlotlyPieChartProps) {
    const { colorPrimary, configPrimaryData, colorScheme } = chartConfig;
    const primaryOrange = getCssVariable('--primary-orange') || 'rgb(234, 84, 0)';
    const primaryColor = colorPrimary;

    const data: Partial<PieData>[] = [
        {
            values: [0, 100],
            textinfo: 'none',
            hole: 0.8,
            type: 'pie',
            hoverinfo: 'skip',
            marker: {
                colors: ['rgba(0,0,0,0)', 'background: rgba(238, 238, 242, 1)'], // GREY SLICE BACKGROUND
            },
        },
        {
            values: [100 - configPrimaryData, configPrimaryData],
            textinfo: 'none',
            textposition: 'inside',
            hoverinfo: 'skip',
            hole: 0.8,
            type: 'pie',
            marker: {
                colors: [primaryOrange, 'rgba(0,0,0,0)'], // ORANGE
            },
            domain: {
                column: 1,
                y: [0.032, 0.967],
            },
            pull: [0.01, 0],
            direction: 'counterclockwise',
            sort: false,
        },
        {
            values: [100 - configPrimaryData, configPrimaryData],
            textinfo: 'none',
            hoverinfo: 'skip',
            textposition: 'inside',
            hole: 0.75,
            type: 'pie',
            marker: {
                colors: ['rgba(0,0,0,0)', primaryColor], // PRIMARY
            },
            domain: {
                column: 1,
            },
            direction: 'counterclockwise',
            sort: false,
            pull: [0, 0.01], // Slightly pull the PRIMARY slice
        },
    ];

    const layout = {
        annotations: [
            {
                font: {
                    size: 32,
                },
                showarrow: false,
                text: configPrimaryData.toString(),
                x: 0.465,
                y: 0.5,
            },
            {
                font: {
                    size: 18,
                },
                showarrow: false,
                text: '%',
                x: 0.775,
            },
        ],
        height: 200,
        width: 200,
        showlegend: false,
        plot_bgcolor: 'rgba(0, 0, 0, 0)',
        paper_bgcolor: 'rgba(0, 0, 0, 0)',
        margin: {
            l: 8,
            r: 8,
            b: 8,
            t: 8,
        },
    };

    const config: Partial<Config> = {
        displaylogo: false,
        modeBarButtonsToRemove: ['toImage'],
    };

    return (
        <StyledWrapper $primaryColor={primaryColor} $colorScheme={colorScheme}>
            <Plot data={data} layout={layout} config={config} />
        </StyledWrapper>
    );
}

export default PlotlyPieChart;
