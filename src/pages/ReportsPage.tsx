import { flushSync } from 'react-dom';
import { extractClosestEdge } from '@atlaskit/pragmatic-drag-and-drop-hitbox/closest-edge';
import { triggerPostMoveFlash } from '@atlaskit/pragmatic-drag-and-drop-flourish/trigger-post-move-flash';
import { getReorderDestinationIndex } from '@atlaskit/pragmatic-drag-and-drop-hitbox/util/get-reorder-destination-index';
import {
    BaseEventPayload,
    DropTargetLocalizedData,
    ElementDragType,
} from '@atlaskit/pragmatic-drag-and-drop/dist/types/internal-types';
import { dropTargetForElements } from '@atlaskit/pragmatic-drag-and-drop/element/adapter';
import { useCallback, useEffect, useRef, useState } from 'react';
import styled from 'styled-components';

import * as u from '../utils';
import invariant from 'tiny-invariant';
import StyledPageWrapper from '../components/PageWrapper';
import PragmaticBlock from '../features/PragmaticDndBlock/PragmaticBlock';

const blocksData = [
    {
        id: 'blockA',
        name: 'Block A',
        items: [
            { id: '1a', name: '#E7CCCC' },
            { id: '1b', name: '#EDE8DC' },
            { id: '1c', name: '#A5B68D' },
        ],
    },
    {
        id: 'blockB',
        name: 'Block B',
        items: [
            { id: '2a', name: '#E7CCCC' },
            { id: '2b', name: '#EDE8DC' },
            { id: '2c', name: '#A5B68D' },
        ],
    },
    {
        id: 'blockC',
        name: 'Block C',
        items: [
            { id: '3a', name: '#E7CCCC' },
            { id: '3b', name: '#EDE8DC' },
            { id: '3c', name: '#A5B68D' },
        ],
    },
];

const StyledBlockWrapper = styled.div``;

function ReportsPage() {
    const [blocks, setBlocks] = useState(blocksData);
    const blockWrapperRef = useRef<HTMLDivElement | null>(null);

    const handleDrop = useCallback(
        // is it ok to use internal types?
        (args: BaseEventPayload<ElementDragType> & DropTargetLocalizedData) => {
            if (!args.location || !args.source) return;

            const { source, location } = args;

            // dragging block information
            const draggedBlockId = source.data.blockId;
            const draggedBlockIndex = blocks.findIndex(block => block.id === draggedBlockId);

            // on which block was draggble dropped
            const [destinationBlockRecord] = location.current.dropTargets;
            const desinationBlockId = destinationBlockRecord.data.blockId;

            const indexOfTarget = blocks.findIndex(block => block.id === desinationBlockId);

            const closestEdgeOfTarget = extractClosestEdge(destinationBlockRecord.data);

            const destinationIndex = getReorderDestinationIndex({
                startIndex: draggedBlockIndex,
                indexOfTarget,
                closestEdgeOfTarget,
                axis: 'vertical',
            });

            const newOrderedBlocks = u.reorder(blocks, draggedBlockIndex, destinationIndex);
            setBlocks(newOrderedBlocks);

            // use
            flushSync(() => {
                const element = document.querySelector(`[data-task-id="${draggedBlockId}"]`);
                if (element instanceof HTMLElement) {
                    triggerPostMoveFlash(element);
                }
            });
        },
        [blocks],
    );

    useEffect(() => {
        const blockWrapperEl = blockWrapperRef.current;
        invariant(blockWrapperEl);

        return dropTargetForElements({
            element: blockWrapperEl,
            getData: () => ({ wrapperId: 'blockWrapper' }),
            onDrop: handleDrop,
        });
    }, [handleDrop]);

    const renderedBlocks = blocks.map(block => {
        return <PragmaticBlock blockData={block} key={block.id} />;
    });

    return (
        <StyledPageWrapper>
            <StyledBlockWrapper ref={blockWrapperRef}>{renderedBlocks}</StyledBlockWrapper>
        </StyledPageWrapper>
    );
}

export default ReportsPage;
