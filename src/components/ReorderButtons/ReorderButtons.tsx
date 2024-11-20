import styled from 'styled-components';
import { ArrowDownIcon, ArrowUpIcon } from '../../assets/icons';

const StyledActionButtonsWrapper = styled.div`
    display: flex;
    gap: 1rem;

    button {
        cursor: pointer;
        padding: 1rem;
        border-radius: var(--card-radius);
        color: var(--primary-blue);

        &:disabled {
            pointer-events: none;
            color: lightgrey;
        }
    }
`;

interface ReorderButtonsProps {
    isFirst: boolean;
    isLast: boolean;
    onMoveUp: () => void;
    onMoveDown: () => void;
}

function ReorderButtons({ isFirst, isLast, onMoveDown, onMoveUp }: ReorderButtonsProps) {
    return (
        <StyledActionButtonsWrapper>
            <button disabled={isLast} aria-disabled={isLast} onClick={onMoveDown}>
                <ArrowDownIcon />
            </button>
            <button disabled={isFirst} aria-disabled={isFirst} onClick={onMoveUp}>
                <ArrowUpIcon />
            </button>
        </StyledActionButtonsWrapper>
    );
}

export default ReorderButtons;
