import React, { useRef } from 'react';
import styled from 'styled-components';
import {
    BaseEventPayload,
    DropTargetLocalizedData,
    ElementDragType,
} from '@atlaskit/pragmatic-drag-and-drop/dist/types/internal-types';
import DropIndicator from '../../components/DropIndicator';
import usePragmaticDndTarget from '../../hooks/usePragmaticDndTarget';

interface PragmaticDndTargetProps {
    dragType: string;
    getInitialData: () => Record<string, string>;
    shouldHandleDrop: (args: BaseEventPayload<ElementDragType> & DropTargetLocalizedData) => boolean;
    renderContent: (handleRef: React.RefObject<HTMLDivElement>) => React.ReactNode;
}

const Container = styled.div`
    position: relative;
`;

const PragmaticDndTarget = ({
    dragType,
    getInitialData,
    shouldHandleDrop,
    renderContent,
}: // children,
PragmaticDndTargetProps) => {
    const elementRef = useRef<HTMLDivElement | null>(null);
    const handleRef = useRef<HTMLDivElement | null>(null);

    const closestEdge = usePragmaticDndTarget({
        elementRef,
        handleRef,
        dragType,
        getInitialData,
        shouldHandleDrop,
    });

    return (
        <Container ref={elementRef} data-drop-type={dragType}>
            {renderContent(handleRef)}
            {/* {children} */}
            {closestEdge && <DropIndicator edge={closestEdge} />}
        </Container>
    );
};

export default PragmaticDndTarget;
