import { attachClosestEdge, extractClosestEdge } from '@atlaskit/pragmatic-drag-and-drop-hitbox/closest-edge';
import { Edge } from '@atlaskit/pragmatic-drag-and-drop-hitbox/types';
import { combine } from '@atlaskit/pragmatic-drag-and-drop/combine';
import {
    BaseEventPayload,
    DropTargetLocalizedData,
    ElementDragType,
} from '@atlaskit/pragmatic-drag-and-drop/dist/types/internal-types';
import { draggable, dropTargetForElements } from '@atlaskit/pragmatic-drag-and-drop/element/adapter';
import { useEffect, useRef, useState } from 'react';
import styled from 'styled-components';
import invariant from 'tiny-invariant';

import { DragHandleIcon } from '../../assets/icons';
import { StyledCardWrapper } from '../../components/Card';
import DropIndicator from '../../components/DropIndicator';
import { BlockData } from '../BeautifulDnbBlock/block.types';
import PragramaticListItem from './PragmaticListItem';

const StyledHeader = styled.header`
    display: flex;
    align-items: center;
    padding: 1rem 0;

    svg {
        margin-right: 1rem;
    }
`;

const StyledHandleWrapper = styled.div`
    cursor: grab;
`;

const StyledList = styled.ul``;

interface PragmaticBlockProps {
    blockData: BlockData;
}

function PragmaticBlock({ blockData }: PragmaticBlockProps) {
    const [closestEdge, setClosestEdge] = useState<Edge | null>(null);
    const { name, items, id } = blockData;
    const blockRef = useRef<HTMLDivElement | null>(null);
    const handleRef = useRef<HTMLDivElement | null>(null);

    useEffect(() => {
        const blockEl = blockRef.current;
        const handleEl = handleRef.current;
        invariant(blockEl, 'Block element is not available');
        invariant(handleEl, 'Handle element is not available');

        // Is it ok, to use import from internal types for BaseEventPayload<ElementDragType> & DropTargetLocalizedData?
        const handleClosestEdgeUpdate = (args: BaseEventPayload<ElementDragType> & DropTargetLocalizedData) => {
            const isDraggableInDropZone = args.source.data.blockId !== id;
            if (isDraggableInDropZone) {
                const extractedEdge = extractClosestEdge(args.self.data);
                setClosestEdge(extractedEdge);
            }
        };

        return combine(
            draggable({
                element: blockEl,
                dragHandle: handleEl,
                getInitialData: () => ({ type: 'block', blockId: id }),
            }),
            dropTargetForElements({
                element: blockEl,
                getData: ({ input, element }) => {
                    const data = { type: 'block', blockId: id };

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
    }, [id]);

    const renderedItems = items.map(item => {
        return <PragramaticListItem itemData={item} key={item.id} />;
    });

    return (
        <StyledCardWrapper ref={blockRef} data-task-id={id}>
            <StyledHeader>
                <StyledHandleWrapper ref={handleRef}>
                    <DragHandleIcon />
                </StyledHandleWrapper>
                <h4>{name}</h4>
            </StyledHeader>
            <StyledList>{renderedItems}</StyledList>
            {closestEdge && <DropIndicator edge={closestEdge} />}
        </StyledCardWrapper>
    );
}

export default PragmaticBlock;
