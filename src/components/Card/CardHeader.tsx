import styled from 'styled-components';
import { doubleChevronUpIcon } from '../../assets/icons';

const StyledCardHeader = styled.div`
    padding: var(--card-padding);
    display: flex;
    align-items: center;
`;

const StyledIconWrapper = styled.span`
    display: flex;
    align-items: center;
    justify-content: center;
    width: 24px;
    height: 24px;
    border: 1px solid var(--icon-border-color);
    border-radius: var(--card-radius);
    background-color: var(--icon-background-color);
    margin-right: 1rem;
`;

interface CardHeaderProps {
    cardHeaderText: string;
}

function CardHeader({ cardHeaderText }: CardHeaderProps) {
    return (
        <StyledCardHeader>
            <StyledIconWrapper>
                <img src={doubleChevronUpIcon} alt='Double chevron up icon' />
            </StyledIconWrapper>
            <h4>{cardHeaderText}</h4>
        </StyledCardHeader>
    );
}

export default CardHeader;
