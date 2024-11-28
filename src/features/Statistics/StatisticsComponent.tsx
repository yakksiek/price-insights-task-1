import { useState } from 'react';
import styled from 'styled-components';
import { CardHeader, StyledCardWrapper } from '../../components/Card';
import { Breakpoints } from '../../types/enums';
import ChartJsPieChart from '../../components/ChartJsPieChart';
import { pricingCampaignsData, chartJDataCampaigns, pricingMonitoringData, chartJsDataMonitoring } from '../../db';
import PieChartRenderer from './components/PieChartRenderer/PieChartRenderer';
// import { useVisibilityContext } from './contexts/VisibilityContext';

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
    // const { state: visibilityState } = useVisibilityContext();

    const handleSetOpen = () => {
        setIsOpen(prevState => !prevState);
    };

    return (
        <StyledCardWrapper>
            <CardHeader cardHeaderText='Statistics' toggleOpenHandler={handleSetOpen} isOpen={isOpen} />
            <CardContent $isOpen={isOpen}>
                <PieChartRenderer
                    configData={pricingCampaignsData}
                    chart={<ChartJsPieChart chartData={chartJDataCampaigns} />}
                />
                <PieChartRenderer
                    configData={pricingMonitoringData}
                    chart={<ChartJsPieChart chartData={chartJsDataMonitoring} />}
                />
            </CardContent>
        </StyledCardWrapper>
    );
}

export default StatisticsComponent;
