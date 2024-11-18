import { DragDropContext, Draggable, DraggableProvidedDragHandleProps, Droppable } from '@hello-pangea/dnd';
import styled from 'styled-components';

import { ArrowDownIcon, ArrowUpIcon } from '../../assets/icons';
import { StyledCardWrapper } from '../../components/Card';
import DraggableHandle from '../../components/DraggableHandle';
import usePangeaDnd from '../../hooks/usePangeaDnd';
import { BlockData } from './block.types';

const StyledHeader = styled.header`
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: var(--header-margin-bottom);
`;

const StyledTitleWrapper = styled.div`
    display: flex;
    align-items: center;
`;

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

const StyledList = styled.ul`
    .item {
        display: flex;
        align-items: center;
        border: 1px solid black;
        padding: 1rem;
        margin-bottom: 1rem;
        border-radius: var(--card-radius);

        img {
            margin-right: 1rem;
        }
    }
`;

interface StyledListItemProps {
    $color: string;
}

const StyledListItem = styled.li<StyledListItemProps>`
    background-color: ${props => props.$color};
`;

interface BlockComponentProps {
    blockData: BlockData;
    isFirst: boolean;
    isLast: boolean;
    onMoveUp: () => void;
    onMoveDown: () => void;
    dragHandleProps: DraggableProvidedDragHandleProps;
}

function BlockComponent({ blockData, isFirst, isLast, onMoveUp, onMoveDown, dragHandleProps }: BlockComponentProps) {
    const { items: blockItems, handleOnDragEnd } = usePangeaDnd(blockData.items);

    const renderedListItems = blockItems.map((item, index) => {
        const { id, name } = item;
        return (
            <Draggable key={id} draggableId={item.id} index={index}>
                {provided => {
                    if (!provided.dragHandleProps) return null;

                    return (
                        <StyledListItem
                            $color={name}
                            className='item'
                            ref={provided.innerRef}
                            {...provided.draggableProps}
                        >
                            <DraggableHandle
                                dragHandleProps={provided.dragHandleProps}
                                marginRight={true}
                                background={true}
                            />
                            <p>{name}</p>
                        </StyledListItem>
                    );
                }}
            </Draggable>
        );
    });

    return (
        <StyledCardWrapper>
            <StyledHeader>
                <StyledTitleWrapper>
                    <DraggableHandle dragHandleProps={dragHandleProps} marginRight={true} />
                    <h4>{blockData.name}</h4>
                </StyledTitleWrapper>
                <StyledActionButtonsWrapper>
                    <button disabled={isLast} aria-disabled={isLast} onClick={onMoveDown}>
                        <ArrowDownIcon />
                    </button>
                    <button disabled={isFirst} aria-disabled={isFirst} onClick={onMoveUp}>
                        <ArrowUpIcon />
                    </button>
                </StyledActionButtonsWrapper>
            </StyledHeader>
            <DragDropContext onDragEnd={handleOnDragEnd}>
                <Droppable droppableId='droppable-elements' direction='vertical'>
                    {provided =>
                        // prettier-ignore
                        <StyledList 
                        {...provided.droppableProps} 
                        ref={provided.innerRef}
                        >
                            {renderedListItems}
                            {provided.placeholder}
                        </StyledList>
                    }
                </Droppable>
            </DragDropContext>
        </StyledCardWrapper>
    );
}

export default BlockComponent;
