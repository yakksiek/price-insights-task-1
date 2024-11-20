import styled from 'styled-components';
import invariant from 'tiny-invariant';
import { attachClosestEdge, extractClosestEdge } from '@atlaskit/pragmatic-drag-and-drop-hitbox/closest-edge';
import { Edge } from '@atlaskit/pragmatic-drag-and-drop-hitbox/dist/types/types';
import { combine } from '@atlaskit/pragmatic-drag-and-drop/combine';
import {
    BaseEventPayload,
    DropTargetLocalizedData,
    ElementDragType,
} from '@atlaskit/pragmatic-drag-and-drop/dist/types/internal-types';
import { draggable, dropTargetForElements } from '@atlaskit/pragmatic-drag-and-drop/element/adapter';
import { useEffect, useRef, useState } from 'react';

import { StyledCardWrapper as StyledBlockWrapper } from '../../components/Card';
import DraggableHandle from '../../components/DraggableHandle';
import DropIndicator from '../../components/DropIndicator';
import { BlockData } from '../../shared/block.types';
import PragramaticListItem from './PragmaticListItem';

const StyledHeader = styled.header`
    display: flex;
    align-items: center;
    height: var(--card-header-height);
`;

interface PragmaticBlockProps {
    blockData: BlockData;
}

function PragmaticBlock({ blockData }: PragmaticBlockProps) {
    const [closestEdge, setClosestEdge] = useState<Edge | null>(null);
    const { name, id } = blockData;
    const blockRef = useRef<HTMLDivElement | null>(null);
    const handleRef = useRef<HTMLDivElement | null>(null);

    useEffect(() => {
        const blockEl = blockRef.current;
        const handleEl = handleRef.current;
        invariant(blockEl, 'Block element is not available');
        invariant(handleEl, 'Handle element is not available');

        const handleClosestEdgeUpdate = (args: BaseEventPayload<ElementDragType> & DropTargetLocalizedData) => {
            if (!args.source) return;

            const draggableType = args.source.data.type;
            const isBlockType = draggableType === 'block';
            if (!isBlockType) return;

            const dropTargets = args.location.current.dropTargets;
            if (dropTargets.length === 0) return;

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
                getIsSticky: () => true,
                onDragEnter: args => handleClosestEdgeUpdate(args),
                onDrag: args => handleClosestEdgeUpdate(args),
                onDragLeave: () => setClosestEdge(null),
                onDrop: () => setClosestEdge(null),
            }),
        );
    }, [id]);

    const renderedItems = blockData.items.map(item => {
        return <PragramaticListItem itemData={item} key={item.id} />;
    });

    return (
        <StyledBlockWrapper ref={blockRef} data-task-id={id}>
            <StyledHeader>
                <div ref={handleRef}>
                    <DraggableHandle marginRight={true} />
                </div>
                <h4>{name}</h4>
            </StyledHeader>
            <ul>{renderedItems}</ul>
            {closestEdge && <DropIndicator edge={closestEdge} />}
        </StyledBlockWrapper>
    );
}

export default PragmaticBlock;
