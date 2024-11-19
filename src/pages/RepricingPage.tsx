import { DragDropContext, Draggable, Droppable } from '@hello-pangea/dnd';

import styled from 'styled-components';
import StyledPageWrapper from '../components/PageWrapper';
import BlockComponent from '../features/BeautifulDnbBlock/BlockComponent';
import StatisticsComponent from '../features/Statistics/StatisticsComponent';
import usePangeaDnd from '../hooks/usePangeaDnd';

const blocksData = [
    {
        id: 'blockA',
        name: 'Block A',
        items: [
            { id: '1a', name: 'crimson' },
            { id: '1b', name: 'lightyellow' },
            { id: '1c', name: 'lightgreen' },
        ],
    },
    {
        id: 'blockB',
        name: 'Block B',
        items: [
            { id: '2a', name: 'crimson' },
            { id: '2b', name: 'lightyellow' },
            { id: '2c', name: 'lightgreen' },
        ],
    },
    {
        id: 'blockC',
        name: 'Block C',
        items: [
            { id: '3a', name: 'crimson' },
            { id: '3b', name: 'lightyellow' },
            { id: '3c', name: 'lightgreen' },
        ],
    },
];

const StyledBlocksWrapper = styled.div``;

function RepricingPage() {
    const { items: blocks, handleOnDragEnd, handleMoveDown, handleMoveUp } = usePangeaDnd(blocksData);

    const renderedBlocks = blocks.map((blockItem, index) => {
        const isFirst = index === 0;
        const isLast = index === blocks.length - 1;

        return (
            <Draggable key={blockItem.id} draggableId={blockItem.id} index={index}>
                {provided => {
                    if (!provided.dragHandleProps) return null;
                    // prettier-ignore
                    return (<div 
                        ref={provided.innerRef} 
                        {...provided.draggableProps} 
                        // {...provided.dragHandleProps}
                         className="draggable-block"
                    >
                        <BlockComponent
                            blockData={blockItem}
                            isFirst={isFirst}
                            isLast={isLast}
                            onMoveUp={() => handleMoveUp(index)}
                            onMoveDown={() => handleMoveDown(index)}
                            dragHandleProps={provided.dragHandleProps}
                        />
                    </div>)
                }}
            </Draggable>
        );
    });

    return (
        <StyledPageWrapper>
            <StatisticsComponent />
            <DragDropContext onDragEnd={handleOnDragEnd}>
                <Droppable droppableId='droppable-blocks' direction='vertical'>
                    {provided => (
                        <StyledBlocksWrapper {...provided.droppableProps} ref={provided.innerRef}>
                            {renderedBlocks}
                            {provided.placeholder}
                        </StyledBlocksWrapper>
                    )}
                </Droppable>
            </DragDropContext>
        </StyledPageWrapper>
    );
}

export default RepricingPage;
