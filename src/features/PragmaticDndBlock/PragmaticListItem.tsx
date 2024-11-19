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
    }
`;

interface PragmaiticBlockItem {
    itemData: ListItem;
    groupName: string;
}

function PragramaticListItem({ itemData, groupName }: PragmaiticBlockItem) {
    const [closestEdge, setClosestEdge] = useState<Edge | null>(null);
    const listItem = useRef<HTMLLIElement | null>(null);
    const handleRef = useRef<HTMLDivElement | null>(null);
    const { name, id } = itemData;
    const itemType = `${groupName}List`;

    useEffect(() => {
        const listItemEl = listItem.current;
        const handleEl = handleRef.current;
        invariant(listItemEl, 'List item element is not available');
        invariant(handleEl, 'Handle item element is not available');

        const handleClosestEdgeUpdate = (args: BaseEventPayload<ElementDragType> & DropTargetLocalizedData) => {
            if (args.source.data.type !== itemType) return;
            const isDraggableInDropZone = args.source.data.blockId !== id;
            if (isDraggableInDropZone) {
                const extractedEdge = extractClosestEdge(args.self.data);
                setClosestEdge(extractedEdge);
            }
        };

        return combine(
            draggable({
                element: listItemEl,
                dragHandle: handleEl,
                getInitialData: () => ({ type: itemType, listItemId: id }),
            }),
            dropTargetForElements({
                element: listItemEl,
                getData: ({ input, element }) => {
                    const data = { type: itemType, listItemId: id };

                    return attachClosestEdge(data, {
                        input,
                        element,
                        allowedEdges: ['top', 'bottom'],
                    });
                },
                onDragEnter: args => {
                    handleClosestEdgeUpdate(args);
                },
                onDrag: args => {
                    handleClosestEdgeUpdate(args);
                },
                onDragLeave: () => {
                    setClosestEdge(null);
                },
                onDrop: () => {
                    setClosestEdge(null);
                },
            }),
        );
    }, [id, itemType]);

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
