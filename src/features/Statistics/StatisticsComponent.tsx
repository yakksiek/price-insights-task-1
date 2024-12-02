import { useState } from 'react';
import styled from 'styled-components';
import { CardHeader, StyledCardWrapper } from '../../components/Card';
import { Breakpoints } from '../../types/enums';
import ChartJsPieChart from '../../components/ChartJsPieChart';
import { pricingCampaignsData, chartJDataCampaigns, pricingMonitoringData, chartJsDataMonitoring } from '../../db';
import PieChartRenderer from './components/PieChartRenderer/PieChartRenderer';
import { useVisibilityContext } from './contexts/VisibilityContext';
import { usePieChartContext } from './contexts/PieChartContext';

interface CardContentProps {
    $isOpen: boolean;
}

const CardContent = styled.div<CardContentProps>`
    padding: 0 var(--card-content-padding);
    display: ${({ $isOpen }) => ($isOpen ? 'block' : 'none')};
    gap: 25px;

    @media ${Breakpoints.MediumLarge} {
        display: ${({ $isOpen }) => ($isOpen ? 'grid' : 'none')};
        grid-auto-flow: column;
    }
`;

function StatisticsComponent() {
    const [isOpen, setIsOpen] = useState(true);
    const { state: visibilityState, toggleVisibility } = useVisibilityContext();
    const { chartState, setChartStateHandler } = usePieChartContext();
    const { monitoringCovered, monitoringNotCovered, campaignCovered, campaignNotCovered } = visibilityState;

    const handleSetOpen = () => {
        setIsOpen(prevState => !prevState);
    };

    const campaignDataValue = visibilityState.campaignCovered ? chartState.campaigns : 0;
    const monitoringDataValue = visibilityState.monitoringCovered ? chartState.monitoring : 0;

    return (
        <StyledCardWrapper>
            <CardHeader cardHeaderText='Statistics' toggleOpenHandler={handleSetOpen} isOpen={isOpen} />
            <CardContent $isOpen={isOpen}>
                <PieChartRenderer
                    configData={pricingCampaignsData}
                    primaryValue={campaignDataValue}
                    chart={
                        <ChartJsPieChart
                            chartData={chartJDataCampaigns}
                            coveredState={campaignCovered}
                            notCoveredState={campaignNotCovered}
                            value={campaignDataValue}
                            primaryValueHandler={() => toggleVisibility('campaignCovered')}
                            secondaryValueHandler={() => toggleVisibility('campaignNotCovered')}
                        />
                    }
                />
                <PieChartRenderer
                    configData={pricingMonitoringData}
                    primaryValue={monitoringDataValue}
                    chart={
                        <ChartJsPieChart
                            chartData={chartJsDataMonitoring}
                            coveredState={monitoringCovered}
                            notCoveredState={monitoringNotCovered}
                            value={monitoringDataValue}
                            primaryValueHandler={() => toggleVisibility('monitoringCovered')}
                            secondaryValueHandler={() => toggleVisibility('monitoringNotCovered')}
                        />
                    }
                />
            </CardContent>
        </StyledCardWrapper>
    );
}

export default StatisticsComponent;
