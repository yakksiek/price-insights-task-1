import { combine } from '@atlaskit/pragmatic-drag-and-drop/combine';
import { draggable, dropTargetForElements } from '@atlaskit/pragmatic-drag-and-drop/element/adapter';
import { useEffect, useRef } from 'react';

import styled from 'styled-components';
import invariant from 'tiny-invariant';

import { DragHandleIcon } from '../../assets/icons';
import { StyledCardWrapper as StyledBlockWrapper } from '../../components/Card';
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
    // const [closestEdge, setClosestEdge] = useState<Edge | null>(null);
    const { name, id } = blockData;
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
                getData: () => ({ blockId: id }),
                getIsSticky: () => true,
            }),
        );
    }, [id]);

    const renderedItems = blockData.items.map(item => {
        return <PragramaticListItem itemData={item} key={item.id} />;
    });

    return (
        <StyledBlockWrapper ref={blockRef} data-task-id={id}>
            <StyledHeader>
                <StyledHandleWrapper ref={handleRef}>
                    <DragHandleIcon />
                </StyledHandleWrapper>
                <h4>{name}</h4>
            </StyledHeader>
            <StyledList>{renderedItems}</StyledList>
            {/* {closestEdge && <DropIndicator edge={closestEdge} />} */}
        </StyledBlockWrapper>
    );
}

export default PragmaticBlock;
