import { useState } from 'react';
import { DragDropContext, Droppable, Draggable, DropResult } from '@hello-pangea/dnd';

import StyledPageWrapper from '../components/PageWrapper';
import BlockComponent from '../features/Block/BlockComponent';
import StatisticsComponent from '../features/Statistics/StatisticsComponent';
import * as u from '../utils';
import styled from 'styled-components';

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
    const [blocks, setBlocks] = useState(blocksData);

    const handleMoveUp = (index: number) => {
        const reorderedBlocks = u.reorder(blocks, index, index - 1);
        setBlocks(reorderedBlocks);
    };

    const handleMoveDown = (index: number) => {
        const reorderedBlocks = u.reorder(blocks, index, index + 1);
        setBlocks(reorderedBlocks);
    };

    const renderedBlocks = blocks.map((blockItem, index) => {
        const isFirst = index === 0;
        const isLast = index === blocks.length - 1;

        return (
            <Draggable key={blockItem.id} draggableId={blockItem.id} index={index}>
                {provided =>
                    // prettier-ignore
                    <div 
                        ref={provided.innerRef} 
                        {...provided.draggableProps} 
                        {...provided.dragHandleProps}
                         className="draggable-block"
                    >
                        <BlockComponent
                            blockData={blockItem}
                            isFirst={isFirst}
                            isLast={isLast}
                            onMoveUp={() => handleMoveUp(index)}
                            onMoveDown={() => handleMoveDown(index)}
                        />
                    </div>
                }
            </Draggable>
        );
    });

    const handleOnDragEnd = (result: DropResult) => {
        const { destination, source } = result;

        if (!destination || destination.index === source.index) return;

        const reorderedBlocks = u.reorder(blocks, source.index, destination.index);
        setBlocks(reorderedBlocks);
    };

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
