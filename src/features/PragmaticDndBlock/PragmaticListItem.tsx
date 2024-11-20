import { attachClosestEdge, extractClosestEdge } from '@atlaskit/pragmatic-drag-and-drop-hitbox/closest-edge';
import { combine } from '@atlaskit/pragmatic-drag-and-drop/combine';
import { draggable, dropTargetForElements } from '@atlaskit/pragmatic-drag-and-drop/element/adapter';
import { useEffect, useRef, useState } from 'react';
import styled from 'styled-components';
import invariant from 'tiny-invariant';

import { Edge } from '@atlaskit/pragmatic-drag-and-drop-hitbox/dist/types/types';
import {
    BaseEventPayload,
    DropTargetLocalizedData,
    ElementDragType,
} from '@atlaskit/pragmatic-drag-and-drop/dist/types/internal-types';
import { DragHandleIcon } from '../../assets/icons';
import DropIndicator from '../../components/DropIndicator';
import { ListItem } from '../BeautifulDnbBlock/block.types';

interface StyledListItemProps {
    $color: string;
}

const StyledListItem = styled.li<StyledListItemProps>`
    position: relative;
    background-color: ${props => props.$color};
    padding: 1rem;
    margin-bottom: 1rem;

    display: flex;
    align-items: center;

    svg {
        margin-right: 1rem;

        &:hover {
            cursor: grab;
        }
    }
`;

interface PragmaiticBlockItem {
    itemData: ListItem;
}

function PragramaticListItem({ itemData }: PragmaiticBlockItem) {
    const [closestEdge, setClosestEdge] = useState<Edge | null>(null);
    const listItem = useRef<HTMLLIElement | null>(null);
    const handleRef = useRef<HTMLDivElement | null>(null);
    const { name, id } = itemData;

    useEffect(() => {
        const listItemEl = listItem.current;
        const handleEl = handleRef.current;
        invariant(listItemEl, 'List item element is not available');
        invariant(handleEl, 'Handle item element is not available');

        const handleClosestEdgeUpdate = (args: BaseEventPayload<ElementDragType> & DropTargetLocalizedData) => {
            if (!args.source) return;

            const draggableType = args.source.data.type;
            const isCardType = draggableType === 'card';
            if (!isCardType) return;

            if (args.location.current.dropTargets.length === 2) {
                const [, destinationBlock] = args.location.current.dropTargets;
                const [, sourceBlock] = args.location.initial.dropTargets;
                const isCorrectBlock = destinationBlock.data.blockId === sourceBlock.data.blockId;
                if (!isCorrectBlock) return;

                const isDraggableInDropZone = args.source.data.cardId !== id;
                if (isDraggableInDropZone) {
                    const extractedEdge = extractClosestEdge(args.self.data);
                    setClosestEdge(extractedEdge);
                }
            }
        };

        return combine(
            draggable({
                element: listItemEl,
                dragHandle: handleEl,
                getInitialData: () => ({ type: 'card', cardId: id }),
            }),
            dropTargetForElements({
                element: listItemEl,
                getData: ({ input, element }) => {
                    const data = { type: 'card', cardId: id };

                    return attachClosestEdge(data, {
                        input,
                        element,
                        allowedEdges: ['top', 'bottom'],
                    });
                },
                getIsSticky: () => true,
                onDragEnter: args => {
                    // Update the closest edge when a draggable item enters the drop zone
                    handleClosestEdgeUpdate(args);
                },
                onDrag: args => {
                    // Continuously update the closest edge while dragging over the drop zone
                    handleClosestEdgeUpdate(args);
                },
                onDragLeave: () => {
                    // Reset the closest edge when the draggable item leaves the drop zone
                    setClosestEdge(null);
                },
                onDrop: () => {
                    // Reset the closest edge when the draggable item is dropped
                    setClosestEdge(null);
                },
            }),
        );
    }, [id]);

    return (
        <StyledListItem $color={name} ref={listItem}>
            <div ref={handleRef}>
                <DragHandleIcon />
            </div>
            <p>{name}</p>
            {closestEdge && <DropIndicator edge={closestEdge} />}
        </StyledListItem>
    );
}

export default PragramaticListItem;
