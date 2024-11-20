import { flushSync } from 'react-dom';
import { reorder } from '@atlaskit/pragmatic-drag-and-drop/reorder';
import { extractClosestEdge } from '@atlaskit/pragmatic-drag-and-drop-hitbox/closest-edge';
import { triggerPostMoveFlash } from '@atlaskit/pragmatic-drag-and-drop-flourish/trigger-post-move-flash';
import { getReorderDestinationIndex } from '@atlaskit/pragmatic-drag-and-drop-hitbox/util/get-reorder-destination-index';
import {
    BaseEventPayload,
    DropTargetLocalizedData,
    ElementDragType,
} from '@atlaskit/pragmatic-drag-and-drop/dist/types/internal-types';
import { dropTargetForElements, monitorForElements } from '@atlaskit/pragmatic-drag-and-drop/element/adapter';
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
            { id: '2a', name: '#b25858' },
            { id: '2b', name: '#61ec6c' },
            { id: '2c', name: '#2d0529' },
        ],
    },
    {
        id: 'blockC',
        name: 'Block C',
        items: [
            { id: '3a', name: '#e501016d' },
            { id: '3b', name: '#d3275d' },
            { id: '3c', name: '#00ddf1' },
        ],
    },
];

const StyledBlockWrapper = styled.div``;

interface ReorderCardArgs {
    blockId: string;
    startIndex: number;
    finishIndex: number;
}

function ReportsPage() {
    const [blocks, setBlocks] = useState(blocksData);
    const blockWrapperRef = useRef<HTMLDivElement | null>(null);

    const reorderCard = useCallback(
        ({ blockId, startIndex, finishIndex }: ReorderCardArgs) => {
            // Get the source column data
            const sourceBlockData = blocks.find(block => block.id === blockId);
            if (!sourceBlockData) return;

            // Call the reorder function to get a new array
            // of cards with the moved card's new position
            const updatedItems = reorder({
                list: sourceBlockData.items,
                startIndex,
                finishIndex,
            });

            const updatedBlocks = blocks.map(block => {
                if (block.id === blockId) {
                    // Update the block with the reordered items
                    return {
                        ...block,
                        items: updatedItems,
                    };
                }
                // Return other blocks as-is
                return block;
            });

            // Update the blocks state
            setBlocks(updatedBlocks);
        },
        [blocks],
    );

    // const handleDrop = useCallback(
    //     // is it ok to use internal types?
    //     (args: BaseEventPayload<ElementDragType>) => {
    //         if (!args.location || !args.source) return;
    //         console.log(args.source.data.type);
    //         // if (args.source.data.type !== 'blockWrapper') return;

    //         const { source, location } = args;

    //         // dragging block information
    //         const draggedBlockId = source.data.blockId;
    //         const draggedBlockIndex = blocks.findIndex(block => block.id === draggedBlockId);

    //         // on which block was draggble dropped
    //         const [destinationBlockRecord] = location.current.dropTargets;
    //         console.log(location.current.dropTargets);
    //         const desinationBlockId = destinationBlockRecord.data.blockId;
    //         console.log(desinationBlockId);

    //         const indexOfTarget = blocks.findIndex(block => block.id === desinationBlockId);

    //         const closestEdgeOfTarget = extractClosestEdge(destinationBlockRecord.data);

    //         const destinationIndex = getReorderDestinationIndex({
    //             startIndex: draggedBlockIndex,
    //             indexOfTarget,
    //             closestEdgeOfTarget,
    //             axis: 'vertical',
    //         });

    //         const newOrderedBlocks = u.reorder(blocks, draggedBlockIndex, destinationIndex);
    //         setBlocks(newOrderedBlocks);

    //         // use
    //         flushSync(() => {
    //             const element = document.querySelector(`[data-task-id="${draggedBlockId}"]`);
    //             if (element instanceof HTMLElement) {
    //                 triggerPostMoveFlash(element);
    //             }
    //         });
    //     },
    //     [blocks],
    // );

    const handleDrop = useCallback(
        (args: BaseEventPayload<ElementDragType>) => {
            if (!args.location || !args.source) return;

            const { source, location } = args;
            const destination = location.current.dropTargets.length;
            if (!destination) {
                return;
            }

            if (source.data.type === 'card') {
                // Retrieve the ID of the card being dragged
                const draggedCardId = source.data.cardId;

                // Get the source column from the initial drop targets
                const [, sourceColumnRecord] = location.initial.dropTargets;

                // Retrieve the ID of the source column
                const sourceBlockId = sourceColumnRecord.data.blockId as string;

                // Get the data of the source column
                const sourceBlockData = blocks.find(block => block.id === sourceBlockId);
                if (!sourceBlockData) return;

                // Get the index of the card being dragged in the source column
                const draggedCardIndex = sourceBlockData.items.findIndex(card => card.id === draggedCardId);

                if (location.current.dropTargets.length === 2) {
                    // console.log(location.current.dropTargets);
                    // Destructure and extract the destination card and column data from the drop targets
                    const [destinationCardRecord, destinationBlockRecord] = location.current.dropTargets;

                    // Extract the destination Block ID from the destination block data
                    const destinationBlockId = destinationBlockRecord.data.blockId;

                    // return if the block is different than the source block
                    if (sourceBlockId !== destinationBlockId) {
                        return console.log('wrong column');
                    }

                    // Find the index of the target card within the destination block's cards
                    const indexOfTarget = sourceBlockData?.items.findIndex(
                        card => card.id === destinationCardRecord.data.cardId,
                    );

                    // Determine the closest edge of the target card: top or bottom
                    const closestEdgeOfTarget = extractClosestEdge(destinationCardRecord.data);

                    const destinationIndex = getReorderDestinationIndex({
                        startIndex: draggedCardIndex,
                        indexOfTarget,
                        closestEdgeOfTarget,
                        axis: 'vertical',
                    });

                    reorderCard({
                        blockId: sourceBlockId,
                        startIndex: draggedCardIndex,
                        finishIndex: destinationIndex,
                    });
                }
            }
        },
        [blocks, reorderCard],
    );

    useEffect(() => {
        return monitorForElements({
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
