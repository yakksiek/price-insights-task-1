import StyledPageWrapper from '../components/PageWrapper';
import BlockComponent from '../features/Block/BlockComponent';
import StatisticsComponent from '../features/Statistics/StatisticsComponent';

function RepricingPage() {
    return (
        <StyledPageWrapper>
            <StatisticsComponent />
            <BlockComponent name='A' />
            {/* <BlockComponent name='B' />
            <BlockComponent name='C' /> */}
        </StyledPageWrapper>
    );
}

export default RepricingPage;
