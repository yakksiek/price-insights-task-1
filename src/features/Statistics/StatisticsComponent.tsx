import { useState } from 'react';
import styled from 'styled-components';
import { CardHeader, StyledCardWrapper } from '../../components/Card';
import { Breakpoints } from '../../types/enums';
import { PieChart } from '../../components/PieChart';
import { pricingCampaignsData, chartJDataCampaigns, pricingMonitoringData, chartJsDataMonitoring } from '../../db';
import { useVisibilityContext } from '../../components/PieChartRenderer/context/VisibilityContext';
import { PieChartRenderer } from '../../components/PieChartRenderer';
import { usePieChartContext } from '../../components/PieChartRenderer/context';

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
    const { chartState } = usePieChartContext();
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
                        <PieChart
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
                        <PieChart
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
