import { DragDropContext, Draggable, Droppable } from "@hello-pangea/dnd";

import StyledPageWrapper from "../components/PageWrapper";
import { repricingBlockData } from "../db";
import BlockComponent from "../features/BeautifulDnbBlock/BlockComponent";
import usePangeaDnd from "../hooks/usePangeaDnd";
import useReorder from "../hooks/useReorder";

// This component is unnecessarily complicated as it renders the Statistics component's children,
// resulting in the Repricing Page (and Reports Page) being polluted with chart configuration data.
// I structured it this way to reuse the Statistics component across two pages and to allow the use
// of a different chart library within the Statistics component.

function RepricingPage() {
  const {
    items: blocks,
    handleOnDragEnd,
    setItems,
  } = usePangeaDnd(repricingBlockData);
  const { handleMoveDown, handleMoveUp } = useReorder({ initialItems: blocks });

  const renderedBlocks = blocks.map((blockItem, index) => {
    const isFirst = index === 0;
    const isLast = index === blocks.length - 1;

    return (
      <Draggable key={blockItem.id} draggableId={blockItem.id} index={index}>
        {(provided) => {
          if (!provided.dragHandleProps) return null;

          return (
            <div ref={provided.innerRef} {...provided.draggableProps}>
              <BlockComponent
                blockData={blockItem}
                isFirst={isFirst}
                isLast={isLast}
                onMoveUp={() => handleMoveUp(index, setItems)}
                onMoveDown={() => handleMoveDown(index, setItems)}
                dragHandleProps={provided.dragHandleProps}
              />
            </div>
          );
        }}
      </Draggable>
    );
  });

  return (
    <StyledPageWrapper>
      <DragDropContext onDragEnd={handleOnDragEnd}>
        <Droppable droppableId="droppable-blocks" direction="vertical">
          {(provided) => (
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
