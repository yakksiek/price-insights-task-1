import { useState } from 'react';
import { DropResult } from '@hello-pangea/dnd';

import * as u from '../utils';

type UseDragAndDropReturn<T> = {
    items: T[];
    handleOnDragEnd: (result: DropResult) => void;
    handleMoveUp: (index: number) => void;
    handleMoveDown: (index: number) => void;
};

function usePangeaDnd<T>(initialItems: T[]): UseDragAndDropReturn<T> {
    const [items, setItems] = useState(initialItems);

    const handleOnDragEnd = (result: DropResult) => {
        const { destination, source } = result;

        if (!destination || destination.index === source.index) return;

        const reorderedBlockItems = u.reorder(items, source.index, destination.index);
        setItems(reorderedBlockItems);
    };

    const handleMoveUp = (index: number) => {
        const reorderedBlocks = u.reorder(items, index, index - 1);
        setItems(reorderedBlocks);
    };

    const handleMoveDown = (index: number) => {
        const reorderedBlocks = u.reorder(items, index, index + 1);
        setItems(reorderedBlocks);
    };

    return {
        items,
        handleOnDragEnd,
        handleMoveUp,
        handleMoveDown,
    };
}

export default usePangeaDnd;
