import {
  DragDropContext,
  Draggable,
  DraggableProvidedDragHandleProps,
  Droppable,
} from "@hello-pangea/dnd";
import styled from "styled-components";

import { StyledCardWrapper } from "../../components/Card";
import DraggableHandle from "../../components/DraggableHandle";
import ReorderButtons from "../../components/ReorderButtons";
import usePangeaDnd from "../../hooks/usePangeaDnd";
import { BlockData } from "../../shared/block.types";

const StyledHeader = styled.header`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: var(--header-margin-bottom);
  height: var(--card-header-height);
`;

const StyledTitleWrapper = styled.div`
  display: flex;
  align-items: center;
  height: 100%;
`;

const StyledList = styled.ul`
  .item {
    display: flex;
    align-items: center;
    border: 1px solid black;
    padding: 1rem;
    margin-bottom: 1rem;
    border-radius: var(--card-radius);

    img {
      margin-right: 1rem;
    }
  }
`;

interface StyledListItemProps {
  $color: string;
}

const StyledListItem = styled.li<StyledListItemProps>`
  background-color: ${(props) => props.$color};
`;

interface BlockComponentProps {
  blockData: BlockData;
  isFirst: boolean;
  isLast: boolean;
  onMoveUp: () => void;
  onMoveDown: () => void;
  dragHandleProps: DraggableProvidedDragHandleProps;
}

function BlockComponent({
  blockData,
  isFirst,
  isLast,
  onMoveUp,
  onMoveDown,
  dragHandleProps,
}: BlockComponentProps) {
  const { items: blockItems, handleOnDragEnd } = usePangeaDnd(blockData.items);

  const renderedListItems = blockItems.map((item, index) => {
    const { id, name } = item;
    return (
      <Draggable key={id} draggableId={item.id} index={index}>
        {(provided) => {
          if (!provided.dragHandleProps) return null;

          return (
            <StyledListItem
              $color={name}
              className="item"
              ref={provided.innerRef}
              {...provided.draggableProps}
            >
              <div {...provided.dragHandleProps}>
                <DraggableHandle marginRight={true} background={true} />
              </div>
              <p>{name}</p>
            </StyledListItem>
          );
        }}
      </Draggable>
    );
  });

  return (
    <StyledCardWrapper>
      <StyledHeader>
        <StyledTitleWrapper>
          <div {...dragHandleProps}>
            <DraggableHandle marginRight={true} />
          </div>
          <h4>{blockData.name}</h4>
        </StyledTitleWrapper>
        <ReorderButtons
          isFirst={isFirst}
          isLast={isLast}
          onMoveDown={onMoveDown}
          onMoveUp={onMoveUp}
        />
      </StyledHeader>
      <DragDropContext onDragEnd={handleOnDragEnd}>
        <Droppable droppableId="droppable-elements" direction="vertical">
          {(provided) => (
            <StyledList {...provided.droppableProps} ref={provided.innerRef}>
              {renderedListItems}
              {provided.placeholder}
            </StyledList>
          )}
        </Droppable>
      </DragDropContext>
    </StyledCardWrapper>
  );
}

export default BlockComponent;
