import { DragDropContext, Draggable, DraggableProvidedDragHandleProps, Droppable } from '@hello-pangea/dnd';
import styled from 'styled-components';

import { arrowDownIcon, arrowUpIcon, dragHandleIcon } from '../../assets/icons';
import { StyledCardWrapper } from '../../components/Card';

const StyledHeader = styled.header`
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: var(--header-margin-bottom);
`;

const StyledTitleWrapper = styled.div`
    display: flex;
    align-items: center;

    img {
        margin-right: 1rem;
        &:hover {
            cursor: grab;
        }
    }
`;

const StyledActionButtonsWrapper = styled.div`
    display: flex;
    gap: 1rem;

    button {
        cursor: pointer;
        border: 1px solid black;
        padding: 1rem;
        border-radius: var(--card-radius);

        &:disabled {
            pointer-events: none;
            border: 1px solid lightgrey;
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

    img:hover {
        cursor: grab;
    }
`;

interface ListItem {
    id: string;
    name: string;
}

interface BlockData {
    items: ListItem[];
    name: string;
    id: string;
}

interface BlockComponentProps {
    blockData: BlockData;
    isFirst: boolean;
    isLast: boolean;
    onMoveUp: () => void;
    onMoveDown: () => void;
    dragHandleProps: DraggableProvidedDragHandleProps;
}

function BlockComponent({ blockData, isFirst, isLast, onMoveUp, onMoveDown, dragHandleProps }: BlockComponentProps) {
    const handleOnDragEnd = () => {
        console.log('first');
    };

    const renderedListItems = blockData.items.map((item, index) => {
        const { id, name } = item;
        return (
            <Draggable key={id} draggableId={item.id} index={index}>
                {provided => (
                    <StyledListItem $color={name} className='item' ref={provided.innerRef} {...provided.draggableProps}>
                        <img src={dragHandleIcon} alt='drag handle icon' {...provided.dragHandleProps} />
                        <p>{name}</p>
                    </StyledListItem>
                )}
            </Draggable>
        );
    });

    return (
        <StyledCardWrapper>
            <StyledHeader>
                <StyledTitleWrapper>
                    <img src={dragHandleIcon} alt='drag handle icon' {...dragHandleProps} />
                    <h4>{blockData.name}</h4>
                </StyledTitleWrapper>
                <StyledActionButtonsWrapper>
                    <button disabled={isLast} aria-disabled={isLast} onClick={onMoveDown}>
                        <img src={arrowDownIcon} alt='arrow down icon' className='arrow-up' />
                    </button>
                    <button disabled={isFirst} aria-disabled={isFirst} onClick={onMoveUp}>
                        <img src={arrowUpIcon} alt='arrow up icon' className='arrow-down' />
                    </button>
                </StyledActionButtonsWrapper>
            </StyledHeader>
            <DragDropContext onDragEnd={handleOnDragEnd}>
                <Droppable droppableId='droppable-elements'>
                    {provided =>
                        // prettier-ignore
                        <StyledList 
                        {...provided.droppableProps} 
                        ref={provided.innerRef}
                        >
                            {renderedListItems}
                        </StyledList>
                    }
                </Droppable>
            </DragDropContext>
        </StyledCardWrapper>
    );
}

export default BlockComponent;
