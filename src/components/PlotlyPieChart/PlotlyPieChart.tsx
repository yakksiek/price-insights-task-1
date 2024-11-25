import { Config, PieData } from 'plotly.js';
import Plot from 'react-plotly.js';
import styled from 'styled-components';

// PROBLEMS & QUESTIONABLE CHOICES
// 1. no gradient on colour slices
// 2. no outer white border on blue slice (visible in Figma layout not on a printscreen provided)
// 3. not programmatically calculated the layered oranged color blow blue
// 4. drop-shadow not working on safari

interface StyledWrapperProps {
    $primaryBlue: string;
}

const StyledWrapper = styled.div<StyledWrapperProps>`
    display: flex;
    gap: 2rem;

    .slice path.surface[style*='fill: ${({ $primaryBlue }) => $primaryBlue}'] {
        filter: drop-shadow(0 0 4px rgba(24, 102, 219, 0.7));
    }
`;

interface ChartConfig {
    configPrimaryData: number;
    colorPrimary: string;
    colorSecondary: string;
}

interface PlotlyPieChartProps {
    chartConfig: ChartConfig;
}

function PlotlyPieChart({ chartConfig }: PlotlyPieChartProps) {
    const { colorPrimary, colorSecondary, configPrimaryData } = chartConfig;
    const primaryBlue = colorPrimary;
    const primaryOrange = colorSecondary;

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
                // y: [0.032, 0.97],
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
                colors: ['rgba(0,0,0,0)', primaryBlue], // BLUE
            },
            domain: {
                column: 1,
                // y: [0, 0.985],
            },
            direction: 'counterclockwise',
            sort: false,
            pull: [0, 0.01], // Slightly pull the BLUE slice
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
        <StyledWrapper $primaryBlue={primaryBlue}>
            <Plot data={data} layout={layout} config={config} />
        </StyledWrapper>
    );
}

export default PlotlyPieChart;
