import { draggable, dropTargetForElements } from '@atlaskit/pragmatic-drag-and-drop/element/adapter';
import { combine } from '@atlaskit/pragmatic-drag-and-drop/combine';
import { attachClosestEdge } from '@atlaskit/pragmatic-drag-and-drop-hitbox/closest-edge';
import { useEffect, useRef } from 'react';
import styled from 'styled-components';
import invariant from 'tiny-invariant';

import { DragHandleIcon } from '../../assets/icons';
import { StyledCardWrapper } from '../../components/Card';
import { BlockData } from '../Block/block.types';
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
    const { name, items, id } = blockData;
    const blockRef = useRef<HTMLDivElement | null>(null);
    const handleRef = useRef<HTMLDivElement | null>(null);

    useEffect(() => {
        const blockEl = blockRef.current;
        const handleEl = handleRef.current;
        invariant(blockEl, 'Block element is not available');
        invariant(handleEl, 'Handle element is not available');

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
            }),
        );
    }, [id]);

    const renderedItems = items.map(item => {
        return <PragramaticListItem itemData={item} key={item.id} />;
    });

    return (
        <StyledCardWrapper ref={blockRef}>
            <StyledHeader>
                <StyledHandleWrapper ref={handleRef}>
                    <DragHandleIcon />
                </StyledHandleWrapper>
                <h4>{name}</h4>
            </StyledHeader>
            <StyledList>{renderedItems}</StyledList>
        </StyledCardWrapper>
    );
}

export default PragmaticBlock;
