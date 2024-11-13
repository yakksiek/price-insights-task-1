import { Outlet, ScrollRestoration } from 'react-router-dom';
import styled from 'styled-components';

const StyledAppLayout = styled.div`
    width: 100%;
    margin: 0 auto;
    padding: 70px 75px 80px 75px;
    border: 1px solid blue;
`;

const StyledMainContent = styled.main`
    background-color: transparent;
    border: 1px solid red;
`;

function AppLayout() {
    return (
        <StyledAppLayout>
            <StyledMainContent>
                <Outlet />
            </StyledMainContent>

            <ScrollRestoration />
        </StyledAppLayout>
    );
}

export default AppLayout;
