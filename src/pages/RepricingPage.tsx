import { DragDropContext, Draggable, Droppable } from '@hello-pangea/dnd';

import StyledPageWrapper from '../components/PageWrapper';
import PlotlyPieChart from '../components/PlotlyPieChart';
import { pricingCampaignsData, pricingMonitoringData, repricingBlockData } from '../db';
import BlockComponent from '../features/BeautifulDnbBlock/BlockComponent';
import PieChartRenderer from '../features/Statistics/PieChartRenderer';
import StatisticsComponent from '../features/Statistics/StatisticsComponent';
import usePangeaDnd from '../hooks/usePangeaDnd';
import useReorder from '../hooks/useReorder';
import { getCssVariable } from '../utils';

// this component is unecessarly complicated rendering Statistics children
// and as a result polluting Repricing Page (and Reports Page)
// with charts config data because I use with different
// pages and different charts

function RepricingPage() {
    const { items: blocks, handleOnDragEnd, setItems } = usePangeaDnd(repricingBlockData);
    const { handleMoveDown, handleMoveUp } = useReorder({ initialItems: blocks });
    const primaryBlue = getCssVariable('--primary-blue') || 'rgb(23, 106, 229)';
    const primaryOrange = getCssVariable('--primary-orange') || 'rgb(234, 84, 0)';

    const chartConfigPricingCampaings = {
        configPrimaryData: pricingCampaignsData.data,
        colorPrimary: primaryBlue,
        colorSecondary: primaryOrange,
    };

    const chartConfigMonitoringData = {
        configPrimaryData: pricingMonitoringData.data,
        colorPrimary: primaryBlue,
        colorSecondary: primaryOrange,
    };

    const renderedBlocks = blocks.map((blockItem, index) => {
        const isFirst = index === 0;
        const isLast = index === blocks.length - 1;

        return (
            <Draggable key={blockItem.id} draggableId={blockItem.id} index={index}>
                {provided => {
                    if (!provided.dragHandleProps) return null;
                    // prettier-ignore
                    return (<div 
                        ref={provided.innerRef} 
                        {...provided.draggableProps} 
                         className="draggable-block"
                    >
                        <BlockComponent
                            blockData={blockItem}
                            isFirst={isFirst}
                            isLast={isLast}
                            onMoveUp={() => handleMoveUp(index, setItems)}
                            onMoveDown={() => handleMoveDown(index, setItems)}
                            dragHandleProps={provided.dragHandleProps}
                        />
                    </div>)
                }}
            </Draggable>
        );
    });

    return (
        <StyledPageWrapper>
            <StatisticsComponent>
                <PieChartRenderer
                    configData={pricingCampaignsData}
                    chart={<PlotlyPieChart chartConfig={chartConfigPricingCampaings} />}
                />
                <PieChartRenderer
                    configData={pricingMonitoringData}
                    chart={<PlotlyPieChart chartConfig={chartConfigMonitoringData} />}
                />
            </StatisticsComponent>
            <DragDropContext onDragEnd={handleOnDragEnd}>
                <Droppable droppableId='droppable-blocks' direction='vertical'>
                    {provided => (
                        <div {...provided.droppableProps} ref={provided.innerRef}>
                            {renderedBlocks}
                            {provided.placeholder}
                        </div>
                    )}
                </Droppable>
            </DragDropContext>
        </StyledPageWrapper>
    );
}

export default RepricingPage;
