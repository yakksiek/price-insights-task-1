import Plot from 'react-plotly.js';
import './App.css';
import { PieData, Config } from 'plotly.js';
import styled from 'styled-components';

const StyledWrapper = styled.div`
    .slice path.surface[style*='fill: rgb(24, 102, 219)'] {
        filter: drop-shadow(0 0 7px rgba(24, 102, 219, 0.7));
    }
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
            <h5>Statistics</h5>
            <Plot data={data} layout={layout} config={config} />
        </StyledWrapper>
    );
}

export default App;
