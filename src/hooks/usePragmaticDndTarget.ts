import { useEffect, useState } from 'react';
import { Edge } from '@atlaskit/pragmatic-drag-and-drop-hitbox/dist/types/types';
import {
    BaseEventPayload,
    DropTargetLocalizedData,
    ElementDragType,
} from '@atlaskit/pragmatic-drag-and-drop/dist/types/internal-types';
import { attachClosestEdge, extractClosestEdge } from '@atlaskit/pragmatic-drag-and-drop-hitbox/closest-edge';
import { combine } from '@atlaskit/pragmatic-drag-and-drop/combine';
import { draggable, dropTargetForElements } from '@atlaskit/pragmatic-drag-and-drop/element/adapter';
import invariant from 'tiny-invariant';

interface UseDraggableDropTargetProps {
    elementRef: React.RefObject<HTMLElement>;
    handleRef: React.RefObject<HTMLElement>;
    dragType: string;
    getInitialData: () => Record<string, string>;
    shouldHandleDrop: (args: BaseEventPayload<ElementDragType> & DropTargetLocalizedData) => boolean;
    allowedEdges?: Edge[];
}

const useDraggableDropTarget = ({
    elementRef,
    handleRef,
    dragType,
    getInitialData,
    shouldHandleDrop,
    allowedEdges = ['bottom', 'top'],
}: UseDraggableDropTargetProps) => {
    const [closestEdge, setClosestEdge] = useState<Edge | null>(null);

    useEffect(() => {
        const element = elementRef.current;
        const handle = handleRef.current;
        invariant(element, 'Element is not available');
        invariant(handle, 'Handle element is not available');

        const handleClosestEdgeUpdate = (args: BaseEventPayload<ElementDragType> & DropTargetLocalizedData) => {
            if (!args.source) return;

            if (!shouldHandleDrop(args)) return;

            if (args.location.current.dropTargets.length === 0) return;

            const extractedEdge = extractClosestEdge(args.self.data);
            setClosestEdge(extractedEdge);
        };

        const cleanup = combine(
            draggable({
                element,
                dragHandle: handle,
                getInitialData,
            }),
            dropTargetForElements({
                element,
                getData: ({ input, element }) =>
                    attachClosestEdge(getInitialData(), {
                        input,
                        element,
                        allowedEdges,
                    }),
                getIsSticky: () => true,
                onDragEnter: handleClosestEdgeUpdate,
                onDrag: handleClosestEdgeUpdate,
                onDragLeave: () => {
                    setClosestEdge(null);
                },
                onDrop: () => {
                    setClosestEdge(null);
                },
            }),
        );

        return () => {
            cleanup();
        };
    }, [elementRef, handleRef, dragType, getInitialData, shouldHandleDrop, allowedEdges]);

    return closestEdge;
};

export default useDraggableDropTarget;
