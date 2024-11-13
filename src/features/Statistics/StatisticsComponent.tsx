import styled from 'styled-components';
import { CardHeader, StyledCardWrapper } from '../../components/Card';
import PlotlyPieChart from '../../components/PlotlyPieChart';
import { useState } from 'react';

const pricingCampaignsData = {
    data: 62.5,
    header: 'Pricing campaigns',
    subheader: 'Ensure complete allocation of products among pricing campaigns',
    labelPrimary: 'Products in pricing campaign',
    labelSecondary: 'Products without pricing campaign',
};

const pricingMonitoringData = {
    data: 20.5,
    header: 'Pricing monitoring',
    subheader: 'Ensure maximum coverage of products through monitoring',
    labelPrimary: 'Assortment is covered by monitoring',
    labelSecondary: 'Assortment not covered by monitoring',
};

interface ChartsWrapperProps {
    $isOpen: boolean;
}

const ChartsWrapper = styled.div<ChartsWrapperProps>`
    display: grid;
    grid-auto-flow: column;
    gap: 92px;
    padding: 0 105px;
    grid-template-rows: ${({ $isOpen }) => ($isOpen ? '1fr' : '0fr')};
    transition: grid-template-rows 0.3s;

    & > * {
        overflow: hidden;
    }
`;

function StatisticsComponent() {
    const [isOpen, setIsOpen] = useState(true);

    const handleSetOpen = () => {
        setIsOpen(prevState => !prevState);
    };

    return (
        <StyledCardWrapper>
            <CardHeader cardHeaderText='Statistics' toggleOpenHandler={handleSetOpen} isOpen={isOpen} />
            <ChartsWrapper $isOpen={isOpen}>
                <PlotlyPieChart configData={pricingCampaignsData} />
                <PlotlyPieChart configData={pricingMonitoringData} />
            </ChartsWrapper>
        </StyledCardWrapper>
    );
}

export default StatisticsComponent;
