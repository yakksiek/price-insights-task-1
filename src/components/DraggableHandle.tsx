import styled from 'styled-components';
import { DragHandleIcon } from '../assets/icons';
import { DraggableProvidedDragHandleProps } from '@hello-pangea/dnd';

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
    width: 16px;
    height: 22px;

    &:hover {
        cursor: grab;
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
    dragHandleProps: DraggableProvidedDragHandleProps;
}

function DraggableHandle({
    color = 'var(--primary-blue)',
    padding = false,
    marginRight = false,
    background = false,
    dragHandleProps,
}: DraggableHandleProps) {
    return (
        <StyledWrapper
            $color={color}
            $padding={padding}
            $marginRight={marginRight}
            $background={background}
            {...dragHandleProps}
        >
            <DragHandleIcon />
        </StyledWrapper>
    );
}

export default DraggableHandle;
