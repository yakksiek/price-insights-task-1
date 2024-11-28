import styled from 'styled-components';
import { HideVisibilityIcon, VisibilityIcon } from '../../assets/icons';
import * as t from '../../types';
import { Breakpoints } from '../../types/enums';
import { useVisibilityContext } from './contexts/VisibilityContext';

const StyledPieChart = styled.div`
    display: flex;
    justify-content: center;
    padding: 0 var(--padding-s);

    @media ${Breakpoints.MediumLarge} {
        flex-direction: column;
    }

    @media ${Breakpoints.ExtraLarge} {
        flex-direction: row;
    }
`;

const StyledChartContainer = styled.div`
    display: flex;
    justify-content: end;
    flex: 1.25;

    @media ${Breakpoints.MediumLarge} {
        justify-content: center;
        flex: 1;
    }
`;

const StyledLegend = styled.div`
    padding: var(--padding-s);
    flex: 2;
    display: flex;
    justify-content: center;
    flex-direction: column;

    p {
        font-size: 0.813rem;
        color: var(--text-placeholder);
    }

    @media ${Breakpoints.MediumLarge} {
        text-align: center;
    }
    @media ${Breakpoints.ExtraLarge} {
        text-align: left;
    }
`;

const StyledHeader = styled.header`
    h5 {
        font-size: 1rem;
    }
`;

const StyledDivider = styled.hr`
    border: 1px solid rgba(224, 224, 237, 1);
    margin: var(--margin-l) 0;
    width: 394px;

    @media ${Breakpoints.MediumLarge} {
        margin: var(--margin-l) auto;
    }

    @media ${Breakpoints.ExtraLarge} {
        margin: var(--margin-l) 0;
    }
`;

const StyledLegendContent = styled.div`
    @media ${Breakpoints.MediumLarge} {
        margin: 0 auto;
    }

    @media ${Breakpoints.ExtraLarge} {
        margin: 0;
    }
`;

const StyledRow = styled.div`
    margin-bottom: var(--margin-l);
    display: flex;
    align-items: center;

    & > * {
        margin-right: 1rem;
    }

    .icon {
        cursor: pointer;
        transition: transform 0.2s ease, box-shadow 0.2s ease;

        &:hover {
            transform: translateY(-2px);
        }
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
    const { data: configPrimaryData, labelPrimary, labelSecondary, header, subheader, id: chartId } = configData;
    const { state: iconsState, toggleVisibility } = useVisibilityContext();
    const iconCoveredDataId = `${chartId}-covered`;
    const iconNotCoveredDataId = `${chartId}--not-covered`;
    const iconCoveredState = iconsState[iconCoveredDataId];
    const iconNotCoveredState = iconsState[iconNotCoveredDataId];

    return (
        <StyledPieChart>
            <StyledChartContainer>{chart}</StyledChartContainer>
            <StyledLegend>
                <StyledHeader>
                    <h5>{header}</h5>
                    <p>{subheader}</p>
                </StyledHeader>
                <StyledDivider />
                <StyledLegendContent>
                    <StyledRow>
                        <div onClick={() => toggleVisibility(iconCoveredDataId)} className='icon'>
                            {iconCoveredState ? <VisibilityIcon /> : <HideVisibilityIcon />}
                        </div>
                        <span className='data'>{configPrimaryData}%</span>
                        <span className='divider'></span>

                        <p className='description'>
                            <StyledDot className='dot' $color={configData.primaryColor || 'blue'} />
                            {labelPrimary}
                        </p>
                    </StyledRow>
                    <StyledRow>
                        <div onClick={() => toggleVisibility(iconNotCoveredDataId)} className='icon'>
                            {iconNotCoveredState ? <VisibilityIcon /> : <HideVisibilityIcon />}
                        </div>
                        <span className='data'>{100 - configPrimaryData}%</span>
                        <span className='divider'></span>

                        <p className='description'>
                            <StyledDot className='dot' $color='orange' />
                            {labelSecondary}
                        </p>
                    </StyledRow>
                </StyledLegendContent>
            </StyledLegend>
        </StyledPieChart>
    );
}

export default PieChartRenderer;
