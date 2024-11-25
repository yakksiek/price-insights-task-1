import styled from 'styled-components';
import { HideVisibilityIcon, VisibilityIcon } from '../../assets/icons';
import { getCssVariable } from '../../utils';

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

interface PieChartRendererProps {
    configData: ConfigData;
    chart: React.ReactNode;
}

function PieChartRenderer({ configData, chart }: PieChartRendererProps) {
    const primaryBlue = getCssVariable('--primary-blue') || 'rgb(23, 106, 229)';
    const primaryOrange = getCssVariable('--primary-orange') || 'rgb(234, 84, 0)';
    const { data: configPrimaryData, labelPrimary, labelSecondary, header, subheader } = configData;

    return (
        <StyledPieChart $primaryBlue={primaryBlue}>
            {chart}
            <StyledLegend>
                <StyledHeader>
                    <h5>{header}</h5>
                    <p>{subheader}</p>
                </StyledHeader>
                <StyledDivider />
                <div>
                    <StyledRow>
                        <VisibilityIcon />
                        <span className='data'>{configPrimaryData}%</span>
                        <span className='divider'></span>

                        <p className='description'>
                            <StyledDot className='dot' />
                            {labelPrimary}
                        </p>
                    </StyledRow>
                    <StyledRow>
                        <HideVisibilityIcon />
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

export default PieChartRenderer;
