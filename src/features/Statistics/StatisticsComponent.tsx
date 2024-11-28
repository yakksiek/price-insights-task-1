import { useState } from 'react';
import styled from 'styled-components';
import { CardHeader, StyledCardWrapper } from '../../components/Card';
import { Breakpoints } from '../../types/enums';

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
            <CardContent $isOpen={isOpen}>{children}</CardContent>
        </StyledCardWrapper>
    );
}

export default StatisticsComponent;
