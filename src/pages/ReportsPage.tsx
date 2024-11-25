import { extractClosestEdge } from '@atlaskit/pragmatic-drag-and-drop-hitbox/closest-edge';
import { getReorderDestinationIndex } from '@atlaskit/pragmatic-drag-and-drop-hitbox/util/get-reorder-destination-index';
import { BaseEventPayload, ElementDragType } from '@atlaskit/pragmatic-drag-and-drop/dist/types/internal-types';
import { monitorForElements } from '@atlaskit/pragmatic-drag-and-drop/element/adapter';
import { useCallback, useEffect, useRef, useState } from 'react';

import ChartJsPieChart from '../components/ChartJsPieChart';
import StyledPageWrapper from '../components/PageWrapper';
import {
    chartJDataCampaigns,
    chartJsDataMonitoring,
    pricingCampaignsData,
    pricingMonitoringData,
    reportsBlockData,
} from '../db';
import PragmaticBlock from '../features/PragmaticDndBlock/PragmaticBlock';
import PieChartRenderer from '../features/Statistics/PieChartRenderer';
import StatisticsComponent from '../features/Statistics/StatisticsComponent';
import useReorder from '../hooks/useReorder';
import * as u from '../utils';

function ReportsPage() {
    const [blocks, setBlocks] = useState(reportsBlockData);
    const { handleMoveDown, handleMoveUp } = useReorder({ initialItems: blocks });
    const blockWrapperRef = useRef<HTMLDivElement | null>(null);

    // I created usePragramticDndTarget for setting files draggable or droppable
    // but this is a simple function, no hook needed, where is the best place for it?
    const handleDrop = useCallback(
        (args: BaseEventPayload<ElementDragType>) => {
            if (!args.location || !args.source) return;

            const { source, location } = args;
            const destinationTargets = location.current.dropTargets;
            if (!destinationTargets) {
                return;
            }

            const draggableSourceType = source.data.type;

            if (draggableSourceType === 'card') {
                const draggedCardId = source.data.cardId as string;

                // get initial starting block > blockID and find the block in the block data
                const [, sourceBlockRecord] = location.initial.dropTargets;
                const sourceBlockId = sourceBlockRecord.data.blockId as string;
                const sourceBlockData = blocks.find(block => block.id === sourceBlockId);
                if (!sourceBlockData) return;

                const draggedCardIndex = u.returnItemIndexInArrById(draggedCardId, sourceBlockData.items);

                // check if source block is the same as destination block
                // because items don't move between blocks
                const [destinationCardRecord, destinationBlockRecord] = location.current.dropTargets;
                const destinationBlockId = destinationBlockRecord.data.blockId;
                if (sourceBlockId !== destinationBlockId) return;

                // Find the index of the target card within the destination block's cards
                const destinationCardId = destinationCardRecord.data.cardId as string;
                const indexOfTarget = u.returnItemIndexInArrById(destinationCardId, sourceBlockData.items);

                // Determine the closest edge of the target card: top or bottom
                const closestEdgeOfTarget = extractClosestEdge(destinationCardRecord.data);

                const destinationIndex = getReorderDestinationIndex({
                    startIndex: draggedCardIndex,
                    indexOfTarget,
                    closestEdgeOfTarget,
                    axis: 'vertical',
                });

                const reorderdBlocks = u.reorderCard({
                    blockId: sourceBlockId,
                    blockData: sourceBlockData,
                    startIndex: draggedCardIndex,
                    finishIndex: destinationIndex,
                    blocks: blocks,
                });

                setBlocks(reorderdBlocks);
            }

            if (draggableSourceType === 'block') {
                const draggedBlockId = source.data.blockId;
                if (!draggedBlockId) return;

                const dropTargets = location.current.dropTargets;
                if (dropTargets.length === 0) return;
                // wonky solution?
                // because of propagation first we catch listItem(card) and then block
                // so in drop targets array block will always be second/last
                // so we take/taget only the last element from the drop targets array
                const destinationBlockRecord = dropTargets[dropTargets.length - 1];
                const destinationBlockId = destinationBlockRecord.data.blockId;

                // if dragged block and destination block are the same, return
                if (draggedBlockId === destinationBlockId) return;

                const draggedBlockIndex = blocks.findIndex(block => block.id === draggedBlockId);
                const destinationBlockIndex = blocks.findIndex(block => block.id === destinationBlockId);

                // Determine the closest edge of the target card: top or bottom
                const closestEdgeOfTarget = extractClosestEdge(destinationBlockRecord.data);

                const destinationIndex = getReorderDestinationIndex({
                    startIndex: draggedBlockIndex,
                    indexOfTarget: destinationBlockIndex,
                    closestEdgeOfTarget,
                    axis: 'vertical',
                });

                const reorderedBlocks = u.reorder(blocks, draggedBlockIndex, destinationIndex);
                setBlocks(reorderedBlocks);
            }
        },
        [blocks],
    );

    useEffect(() => {
        return monitorForElements({
            onDrop: handleDrop,
        });
    }, [handleDrop]);

    const renderedBlocks = blocks.map((block, index) => {
        const isFirst = index === 0;
        const isLast = index === blocks.length - 1;

        return (
            <PragmaticBlock
                blockData={block}
                key={block.id}
                onMoveUp={() => handleMoveUp(index, setBlocks)}
                onMoveDown={() => handleMoveDown(index, setBlocks)}
                isFirst={isFirst}
                isLast={isLast}
            />
        );
    });

    return (
        <StyledPageWrapper>
            <StatisticsComponent>
                <PieChartRenderer
                    configData={pricingCampaignsData}
                    chart={<ChartJsPieChart chartData={chartJDataCampaigns} />}
                />
                <PieChartRenderer
                    configData={pricingMonitoringData}
                    chart={<ChartJsPieChart chartData={chartJsDataMonitoring} />}
                />
            </StatisticsComponent>
            <div ref={blockWrapperRef}>{renderedBlocks}</div>
        </StyledPageWrapper>
    );
}

export default ReportsPage;
