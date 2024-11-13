import styled from 'styled-components';
import { CardHeader, StyledCardWrapper } from '../../components/Card';
import PlotlyPieChart from '../../components/PlotlyPieChart';

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

const ChartsWrapper = styled.div`
    display: flex;
    /* justify-content: space-between; */
    gap: 92px;
    padding: 0 105px;
`;

function StatisticsComponent() {
    return (
        <StyledCardWrapper>
            <CardHeader cardHeaderText='Statistics' />
            <ChartsWrapper>
                <PlotlyPieChart configData={pricingCampaignsData} />
                <PlotlyPieChart configData={pricingMonitoringData} />
            </ChartsWrapper>
        </StyledCardWrapper>
    );
}

export default StatisticsComponent;
