import { Outlet, ScrollRestoration } from 'react-router-dom';
import styled from 'styled-components';
import Header from './Header';

const StyledAppLayout = styled.div``;

const StyledMainContent = styled.main`
    padding: 70px 75px 80px 75px;
    background-color: transparent;
    height: 100vh;
`;

function AppLayout() {
    return (
        <StyledAppLayout>
            <Header />
            <StyledMainContent>
                <Outlet />
            </StyledMainContent>

            <ScrollRestoration />
        </StyledAppLayout>
    );
}

export default AppLayout;
