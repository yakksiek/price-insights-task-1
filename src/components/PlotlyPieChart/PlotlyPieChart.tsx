import { Config, PieData } from 'plotly.js';
import Plot from 'react-plotly.js';
import styled from 'styled-components';
import { hideVisibilityIcon, visibilityIcon } from '../../assets/icons';
import { getCssVariable } from '../../utils';

// PROBLEMS & QUESTIONABLE CHOICES
// 1. no gradient on colour slices
// 2. no outer white border on blue slice (visible in Figma layout not on a printscreen provided)
// 3. not programmatically calculated the layered oranged color blow blue
// 4. drop-shadow not working on safari

interface StyledPieChartProps {
    $primaryBlue: string;
}

const StyledPieChart = styled.div<StyledPieChartProps>`
    display: flex;
    gap: 2rem;

    .slice path.surface[style*='fill: ${({ $primaryBlue }) => $primaryBlue}'] {
        filter: drop-shadow(0 0 4px rgba(24, 102, 219, 0.7));
    }
`;

const StyledLegend = styled.div`
    p {
        font-size: 0.813rem;
        color: var(--text-placeholder);
    }
`;

const StyledHeader = styled.header`
    h5 {
        font-size: 1rem;
    }
`;

const StyledDivider = styled.hr`
    border: 1px solid rgba(224, 224, 237, 1);
    margin: 1.375rem 0;
`;

const StyledRow = styled.div`
    margin: 1.375rem 0;
    display: flex;
    align-items: center;

    & > * {
        margin-right: 1rem;
    }

    .icon {
        cursor: pointer;
    }

    .data {
        width: 76px;
        font-size: 22px;
        font-weight: 300;
        line-height: 28.6px;
    }

    .divider {
        width: 8px;
        height: 1px;
        background-color: var(--text-placeholder);
        display: inline-block;
        vertical-align: middle;
    }

    .description {
        font-weight: 600;
        color: var(--font-color);
        font-size: 0.875rem;
        display: flex;
    }
`;

const StyledDot = styled.span<{ color?: string }>`
    display: inline-block;
    margin-right: 0.5rem;
    width: 1rem;
    height: 1rem;
    border-radius: 50%;
    background: ${({ color }) => color || 'var(--primary-blue)'};
`;

interface ConfigData {
    data: number;
    labelPrimary: string;
    labelSecondary: string;
    header: string;
    subheader: string;
}

interface PlotlyPieChartProps {
    configData: ConfigData;
}

function PlotlyPieChart({ configData }: PlotlyPieChartProps) {
    const primaryBlue = getCssVariable('--primary-blue') || 'rgb(23, 106, 229)';
    const primaryOrange = getCssVariable('--primary-orange') || 'rgb(234, 84, 0)';
    const { data: configPrimaryData, labelPrimary, labelSecondary, header, subheader } = configData;

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
        <StyledPieChart $primaryBlue={primaryBlue}>
            <Plot data={data} layout={layout} config={config} />
            <StyledLegend>
                <StyledHeader>
                    <h5>{header}</h5>
                    <p>{subheader}</p>
                </StyledHeader>
                <StyledDivider />
                <div>
                    <StyledRow>
                        <img className='icon' src={visibilityIcon} alt='Visibility Icon' />
                        <span className='data'>{configPrimaryData}%</span>
                        <span className='divider'></span>

                        <p className='description'>
                            <StyledDot className='dot' />
                            {labelPrimary}
                        </p>
                    </StyledRow>
                    <StyledRow>
                        <img className='icon' src={hideVisibilityIcon} alt='Hide visibility Icon' />
                        <span className='data'>{100 - configPrimaryData}%</span>
                        <span className='divider'></span>

                        <p className='description'>
                            <StyledDot className='dot' color={primaryOrange} />
                            {labelSecondary}
                        </p>
                    </StyledRow>
                </div>
            </StyledLegend>
        </StyledPieChart>
    );
}

export default PlotlyPieChart;
