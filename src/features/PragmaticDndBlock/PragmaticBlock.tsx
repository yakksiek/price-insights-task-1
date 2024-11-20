import {
    BaseEventPayload,
    DropTargetLocalizedData,
    ElementDragType,
} from '@atlaskit/pragmatic-drag-and-drop/dist/types/internal-types';
import styled from 'styled-components';

import { StyledCardWrapper as StyledBlockWrapper } from '../../components/Card';
import DraggableHandle from '../../components/DraggableHandle';
import { BlockData } from '../../shared/block.types';
import PragmaticDndTarget from './PragmaticDndTarget';
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
    const { name, id } = blockData;

    const handleShouldHandleDrop = (args: BaseEventPayload<ElementDragType> & DropTargetLocalizedData) => {
        if (!args.source) return false;

        const draggableElement = args.source.data;
        const draggableType = draggableElement.type;
        const isBlockType = draggableType === 'block';
        if (!isBlockType) return false;

        const dropTargets = args.location.current.dropTargets;
        if (dropTargets.length === 0) return false;

        const isDraggableInDropZone = draggableElement.blockId !== id;
        return isDraggableInDropZone;
    };

    const renderedItems = blockData.items.map(item => {
        return <PragramaticListItem itemData={item} key={item.id} />;
    });

    const renderedContent = (handleRef: React.RefObject<HTMLDivElement>) => {
        return (
            <StyledBlockWrapper>
                <StyledHeader>
                    <div ref={handleRef}>
                        <DraggableHandle marginRight={true} />
                    </div>
                    <h4>{name}</h4>
                </StyledHeader>
                <ul>{renderedItems}</ul>
            </StyledBlockWrapper>
        );
    };

    return (
        <PragmaticDndTarget
            dragType='block'
            getInitialData={() => ({ type: 'block', blockId: id })}
            shouldHandleDrop={handleShouldHandleDrop}
            renderContent={renderedContent}
        />
    );
}

export default PragmaticBlock;
