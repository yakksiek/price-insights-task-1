import styled from 'styled-components';
import Plot from 'react-plotly.js';
import { PieData, Config } from 'plotly.js';
import { visibilityIcon, hideVisibilityIcon } from './assets/icons';

const StyledWrapper = styled.div`
    border-radius: 0.5rem;
    h5 {
        text-align: left;
    }

    background: rgba(246, 246, 248, 1);
    .slice path.surface[style*='fill: rgb(24, 102, 219)'] {
        filter: drop-shadow(0 0 7px rgba(24, 102, 219, 0.7));
    }
`;

const StyledPieChart = styled.div`
    display: flex;
`;

const StyledGroupHeader = styled.div`
    padding: 1.125rem 0.938rem;
`;

const StyledLegend = styled.div`
    p {
        font-size: 0.813rem;
        color: rgba(112, 112, 144, 1);
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
    /* margin-right: 0.5rem; */
`;

const StyledRow = styled.div`
    margin: 1.375rem 0;
    display: flex;
    align-items: center;

    & > * {
        margin-right: 1rem;
    }

    .row {
        font-size: 1.375rem;
    }

    .icon {
        cursor: pointer;
    }

    .description {
        font-weight: 700;
        color: var(--font-color);
        font-size: 0.875rem;
    }
`;

const StyledDot = styled.span<{ color?: string }>`
    display: inline-block;
    width: 10px;
    height: 10px;
    border-radius: 50%;
    background: ${({ color }) => color || 'rgba(24, 102, 219, 1)'};
`;

function App() {
    const data: Partial<PieData>[] = [
        {
            values: [0, 100],
            labels: ['', ''],
            textinfo: 'none',
            hole: 0.8,
            type: 'pie',
            hoverinfo: 'skip',
            marker: {
                colors: ['rgba(0,0,0,0)', 'rgb(238 238 242)'], // GREY
            },
        },
        {
            values: [100 - 62.5, 62.5], // Full thickness for "US", invisible "China"
            labels: ['US', ''],
            textinfo: 'none',
            text: 'Prices',
            textposition: 'inside',
            name: 'US Emissions',
            hoverinfo: 'skip',
            hole: 0.8,
            type: 'pie',
            marker: {
                colors: ['#e94723', 'rgba(0,0,0,0)'], // ORANGE
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
            values: [100 - 62.5, 62.5],
            labels: ['', 'China'],
            text: 'Prices',
            textinfo: 'none',
            hoverinfo: 'skip',
            textposition: 'inside',
            name: 'China Emissions',
            hole: 0.75,
            type: 'pie',
            marker: {
                colors: ['rgba(0,0,0,0)', 'rgb(24, 102, 219)'], // BLUE
            },
            domain: { column: 1 },
            direction: 'counterclockwise',
            sort: false,
            pull: [0, 0.01], // Slightly pull the China slice
        },
    ];

    const layout = {
        annotations: [
            {
                font: {
                    size: 32,
                },
                showarrow: false,
                text: '62.5',
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
        <StyledWrapper>
            <StyledGroupHeader>
                <h5>Statistics</h5>
            </StyledGroupHeader>
            <StyledPieChart>
                <Plot data={data} layout={layout} config={config} />
                <StyledLegend>
                    <StyledHeader>
                        <h5>Pricing campaigns</h5>
                        <p>Ensure complete allocation of products among pricing campaigns</p>
                    </StyledHeader>
                    <StyledDivider />
                    <div>
                        <StyledRow>
                            <img className='icon' src={visibilityIcon} alt='Visibility Icon' />
                            <span className='data'>62.5%</span>
                            <span className='divider'>-</span>

                            <p className='description'>
                                <StyledDot className='dot' /> Products in pricing campaign
                            </p>
                        </StyledRow>
                        <StyledRow>
                            <img className='icon' src={hideVisibilityIcon} alt='Hide visibility Icon' />
                            <span className='data'>37.5%</span>
                            <span className='divider'>-</span>

                            <p className='description'>
                                <StyledDot className='dot' color={'#e94723'} /> Products in pricing campaign
                            </p>
                        </StyledRow>
                    </div>
                </StyledLegend>
            </StyledPieChart>
        </StyledWrapper>
    );
}

export default App;
