import styled from 'styled-components';
import { doubleChevronUpIcon } from '../../assets/icons';

const StyledCardHeader = styled.div`
    padding: var(--card-padding);
    display: flex;
    align-items: center;
`;

interface StyledIconWrapperProps {
    $isOpen: boolean;
}

const StyledIconWrapper = styled.span<StyledIconWrapperProps>`
    display: flex;
    align-items: center;
    justify-content: center;
    width: 24px;
    height: 24px;
    border: 1px solid var(--icon-border-color);
    border-radius: var(--card-radius);
    background-color: var(--icon-background-color);
    margin-right: 1rem;
    cursor: pointer;

    img {
        transition: transform 0.3s ease;
        transform: ${({ $isOpen }) => ($isOpen ? 'rotate(0deg)' : 'rotate(180deg)')};
    }
`;

interface CardHeaderProps {
    cardHeaderText: string;
    toggleOpenHandler: () => void;
    isOpen: boolean;
}

function CardHeader({ cardHeaderText, toggleOpenHandler, isOpen }: CardHeaderProps) {
    return (
        <StyledCardHeader>
            <StyledIconWrapper onClick={toggleOpenHandler} $isOpen={isOpen}>
                <img src={doubleChevronUpIcon} alt='Double chevron up icon' />
            </StyledIconWrapper>
            <h4>{cardHeaderText}</h4>
        </StyledCardHeader>
    );
}

export default CardHeader;