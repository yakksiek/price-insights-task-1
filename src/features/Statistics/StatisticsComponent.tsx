import { useState } from 'react';
import styled from 'styled-components';
import { CardHeader, StyledCardWrapper } from '../../components/Card';
import { Breakpoints } from '../../types/enums';

interface ChartsWrapperProps {
    $isOpen: boolean;
}

const ChartsWrapper = styled.div<ChartsWrapperProps>`
    display: grid;
    grid-auto-flow: row;
    padding: 0 40px;
    grid-template-rows: ${({ $isOpen }) => ($isOpen ? '1fr' : '0fr')};
    transition: grid-template-rows 0.3s;
    margin: 0 auto;
    gap: 25px;

    & > * {
        overflow: hidden;
    }

    @media ${Breakpoints.MediumLarge} {
        grid-auto-flow: column;
    }
`;

interface StatisticsComponentProps {
    children: React.ReactNode;
}

function StatisticsComponent({ children }: StatisticsComponentProps) {
    const [isOpen, setIsOpen] = useState(true);

    const handleSetOpen = () => {
        setIsOpen(prevState => !prevState);
    };

    return (
        <StyledCardWrapper>
            <CardHeader cardHeaderText='Statistics' toggleOpenHandler={handleSetOpen} isOpen={isOpen} />
            <ChartsWrapper $isOpen={isOpen}>{children}</ChartsWrapper>
        </StyledCardWrapper>
    );
}

export default StatisticsComponent;
