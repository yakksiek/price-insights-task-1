import styled from 'styled-components';
import { DragHandleIcon } from '../assets/icons';

interface StyledWrapperProps {
    $color: string;
    $padding: boolean;
    $marginRight: boolean;
    $background: boolean;
}

const StyledWrapper = styled.div<StyledWrapperProps>`
    color: ${({ $color }) => $color};
    ${({ $padding }) => $padding && 'padding: 16px'};
    ${({ $marginRight }) => $marginRight && 'margin-right: 16px'};
    ${({ $background }) => $background && 'background: var(--icon-background-transparent)'};
    display: flex;
    align-items: center;
    justify-content: center;
    border-radius: var(--icon-bg-radius);
    height: 22px;
    width: 14px;

    &:hover {
        cursor: grab;
    }

    &:active {
        cursor: grabbing;
    }

    svg {
        height: 13px;
        width: 8px;
    }
`;

interface DraggableHandleProps {
    color?: string;
    padding?: boolean;
    marginRight?: boolean;
    background?: boolean;
}

function DraggableHandle({
    color = 'var(--primary-blue)',
    padding = false,
    marginRight = false,
    background = false,
}: DraggableHandleProps) {
    return (
        <StyledWrapper $color={color} $padding={padding} $marginRight={marginRight} $background={background}>
            <DragHandleIcon />
        </StyledWrapper>
    );
}

export default DraggableHandle;
