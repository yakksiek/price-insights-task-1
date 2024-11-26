import styled from 'styled-components';
import { HideVisibilityIcon, VisibilityIcon } from '../../assets/icons';
import * as t from '../../types';
import { Breakpoints } from '../../types/enums';

const StyledPieChart = styled.div`
    margin: 0 auto;
    display: flex;
    gap: 2rem;

    @media ${Breakpoints.MediumLarge} {
        flex-direction: column;
    }

    @media ${Breakpoints.ExtraLarge} {
        flex-direction: row;
    }
`;

const StyledChartContainer = styled.div`
    display: flex;
    justify-content: center;
    align-items: center;
    margin: var(--margin-l);
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

type AccentColors = 'blue' | 'purple' | 'orange';

const StyledDot = styled.span<{ $color?: AccentColors }>`
    display: inline-block;
    margin-right: 0.5rem;
    width: 1rem;
    height: 1rem;
    border-radius: 50%;
    background: ${({ $color }) => ($color ? `var(--primary-${$color})` : 'var(--primary-blue)')};
`;

interface PieChartRendererProps {
    configData: t.ChartMetadata;
    chart: React.ReactNode;
}

function PieChartRenderer({ configData, chart }: PieChartRendererProps) {
    const { data: configPrimaryData, labelPrimary, labelSecondary, header, subheader } = configData;

    return (
        <StyledPieChart>
            <StyledChartContainer>{chart}</StyledChartContainer>
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
                            <StyledDot className='dot' $color={configData.primaryColor || 'blue'} />
                            {labelPrimary}
                        </p>
                    </StyledRow>
                    <StyledRow>
                        <HideVisibilityIcon />
                        <span className='data'>{100 - configPrimaryData}%</span>
                        <span className='divider'></span>

                        <p className='description'>
                            <StyledDot className='dot' $color='orange' />
                            {labelSecondary}
                        </p>
                    </StyledRow>
                </div>
            </StyledLegend>
        </StyledPieChart>
    );
}

export default PieChartRenderer;
