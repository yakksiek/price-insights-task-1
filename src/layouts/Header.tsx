import styled from 'styled-components';
import { logoIcon } from '../assets/icons';
import { NavLink } from 'react-router-dom';

const StyledHeader = styled.header`
    height: var(--header-height);
    display: flex;
    align-items: center;
    padding: 0 75px;
    box-shadow: 6px 0px 60px 0px rgba(17, 17, 25, 0.1);
`;

const NavLinks = styled.nav`
    display: flex;
    align-items: center;
    gap: 20px;
    height: 100%;
    margin-left: 140px;
`;

const StyledNavLink = styled(NavLink)`
    font-size: var(--font-size-default);
    color: var(--text-placeholder);
    font-weight: 600;
    padding: 10px 15px;
    transition: background-color 0.3s;
    height: 100%;
    display: flex;
    align-items: center;

    &.active {
        border-bottom: 1px solid black;
        color: var(--font-color);
    }
`;

function Header() {
    return (
        <StyledHeader>
            <img src={logoIcon} alt='logo icon wrapper' />
            <NavLinks>
                <StyledNavLink to='/reports'>Reports</StyledNavLink>
                <StyledNavLink to='/repricing'>Repricing</StyledNavLink>
            </NavLinks>
        </StyledHeader>
    );
}

export default Header;
