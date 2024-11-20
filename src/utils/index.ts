import { BlockData } from '../shared/block.types';

export const getCssVariable = (variable: string) =>
    getComputedStyle(document.documentElement).getPropertyValue(variable).trim();

export function reorder<T>(list: T[], startIndex: number, endIndex: number): T[] {
    const result = Array.from(list);
    const [movedItem] = result.splice(startIndex, 1);
    result.splice(endIndex, 0, movedItem);
    return result;
}

export function returnItemIndexInArrById<T extends { id: number | string }>(itemId: T['id'], arrayData: T[]): number {
    return arrayData.findIndex(item => item.id === itemId);
}

interface ReorderCardArgs {
    blockId: string;
    blockData: BlockData;
    startIndex: number;
    finishIndex: number;
    blocks: BlockData[];
}

export function reorderCard({ blockId, blockData, startIndex, finishIndex, blocks }: ReorderCardArgs) {
    const reorderedItems = reorder(blockData.items, startIndex, finishIndex);

    const updatedBlocks = blocks.map(block => {
        if (block.id === blockId) {
            return {
                ...block,
                items: reorderedItems,
            };
        }
        return block;
    });

    return updatedBlocks;
}
