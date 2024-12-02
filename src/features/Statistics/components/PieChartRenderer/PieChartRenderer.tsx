import { HideVisibilityIcon, VisibilityIcon } from '../../../../assets/icons';
import * as t from '../../../../types';
import { useVisibilityContext } from '../../contexts/VisibilityContext';
import { VisibilityKey } from '../../types/types';
import {
    StyledChartContainer,
    StyledDivider,
    StyledDot,
    StyledHeader,
    StyledLegend,
    StyledLegendContent,
    StyledPieChart,
    StyledRow,
} from './styled';

interface PieChartRendererProps {
    configData: t.ChartMetadata;
    chart: React.ReactNode;
    primaryValue: number;
}

function PieChartRenderer({ configData, chart, primaryValue }: PieChartRendererProps) {
    const { labelPrimary, labelSecondary, header, subheader, id: chartId } = configData;
    const { state: iconsState, toggleVisibility } = useVisibilityContext();

    const iconCoveredDataId = `${chartId}Covered` as VisibilityKey;
    const iconNotCoveredDataId = `${chartId}NotCovered` as VisibilityKey;
    const iconCoveredState = iconsState[iconCoveredDataId];
    const iconNotCoveredState = iconsState[iconNotCoveredDataId];

    const notCoveredValue = !iconNotCoveredState ? 0 : iconCoveredState ? 100 - primaryValue : 100;
    const coveredValue = !iconNotCoveredState ? (!iconCoveredState ? 0 : 100) : primaryValue;

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
                        <div onClick={() => toggleVisibility(iconCoveredDataId)} className='icon-wrapper'>
                            {iconCoveredState ? <VisibilityIcon /> : <HideVisibilityIcon />}
                        </div>
                        <span className='data'>{coveredValue}%</span>
                        <span className='divider'></span>

                        <p className='description'>
                            <StyledDot className='dot' $color='blue' />
                            {labelPrimary}
                        </p>
                    </StyledRow>
                    <StyledRow>
                        <div onClick={() => toggleVisibility(iconNotCoveredDataId)} className='icon-wrapper'>
                            {iconNotCoveredState ? <VisibilityIcon /> : <HideVisibilityIcon />}
                        </div>
                        <span className='data'>{notCoveredValue}%</span>
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
