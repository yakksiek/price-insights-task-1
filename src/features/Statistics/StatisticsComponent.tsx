import { useState } from 'react';
import styled from 'styled-components';
import { CardHeader, StyledCardWrapper } from '../../components/Card';
import { Breakpoints } from '../../types/enums';
import { PieChart } from '../../components/PieChart';
import { pricingCampaignsData, pricingMonitoringData } from '../../db';
import { PieChartRenderer } from '../../components/PieChartRenderer';
import { useChartRendererContext } from '../../components/PieChartRenderer/context';
import { IChartData, PieChartType } from '../../components/PieChart/types';

interface CardContentProps {
    $isOpen: boolean;
}

const CAMPAIGNS_DATA = 63.5;
const MONITORING_DATA = 23.4;

const createChartData = (id: PieChartType): IChartData => ({
    id,
    primaryColor: '#176AE5',
    primaryGradientColors: ['#0d3b7f', '#176AE5'],
    primaryColorShadow: '#5789d5',
    secondaryColor: '#EA5400',
    secondaryGradientColors: ['#e51793', '#EA5400'],
});

const chartJDataCampaigns = createChartData('campaigns');
const chartJsDataMonitoring = createChartData('monitoring');

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
    const { state: visibilityState, toggleVisibility } = useChartRendererContext();
    const { monitoringCovered, monitoringNotCovered, campaignCovered, campaignNotCovered } = visibilityState;

    const handleSetOpen = () => {
        setIsOpen(prevState => !prevState);
    };

    const campaignDataValue = visibilityState.campaignCovered ? CAMPAIGNS_DATA : 0;
    const monitoringDataValue = visibilityState.monitoringCovered ? MONITORING_DATA : 0;

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
