import {
  BaseEventPayload,
  DropTargetLocalizedData,
  ElementDragType,
} from "@atlaskit/pragmatic-drag-and-drop/dist/types/internal-types";
import styled from "styled-components";
import { Edge } from "@atlaskit/pragmatic-drag-and-drop-hitbox/dist/types/types";

import { StyledCardWrapper as StyledBlockWrapper } from "../../components/Card";
import DraggableHandle from "../../components/DraggableHandle";
import { BlockData } from "../../shared/block.types";
import PragmaticDndTarget from "./PragmaticDndTarget";
import PragramaticListItem from "./PragmaticListItem";
import ReorderButtons from "../../components/ReorderButtons";

const StyledHeader = styled.header`
  display: flex;
  align-items: center;
  justify-content: space-between;
  height: var(--card-header-height);
`;

const StyledTitleWrapper = styled.div`
  display: flex;
  align-items: center;
  height: 100%;
`;

interface PragmaticBlockProps {
  blockData: BlockData;
  onMoveUp: () => void;
  onMoveDown: () => void;
  isFirst: boolean;
  isLast: boolean;
}

function PragmaticBlock({
  blockData,
  onMoveDown,
  onMoveUp,
  isLast,
  isFirst,
}: PragmaticBlockProps) {
  const { name, id } = blockData;
  const allowedEdges: Edge[] = isFirst ? ["top", "bottom"] : ["bottom"];

  const handleShouldHandleDrop = (
    args: BaseEventPayload<ElementDragType> & DropTargetLocalizedData,
  ) => {
    if (!args.source) return false;

    const draggableElement = args.source.data;
    const draggableType = draggableElement.type;
    const isBlockType = draggableType === "block";
    if (!isBlockType) return false;

    const dropTargets = args.location.current.dropTargets;
    if (dropTargets.length === 0) return false;

    const isDraggableInDropZone = draggableElement.blockId !== id;
    return isDraggableInDropZone;
  };

  const renderedItems = blockData.items.map((item, index) => {
    const isFirst = index === 0;
    return (
      <PragramaticListItem itemData={item} key={item.id} isFirst={isFirst} />
    );
  });

  const renderedContent = (handleRef: React.RefObject<HTMLDivElement>) => {
    return (
      <StyledBlockWrapper>
        <StyledHeader>
          <StyledTitleWrapper>
            <div ref={handleRef}>
              <DraggableHandle marginRight={true} />
            </div>
            <h4>{name}</h4>
          </StyledTitleWrapper>
          <ReorderButtons
            isFirst={isFirst}
            isLast={isLast}
            onMoveDown={onMoveDown}
            onMoveUp={onMoveUp}
          />
        </StyledHeader>
        <ul>{renderedItems}</ul>
      </StyledBlockWrapper>
    );
  };

  return (
    <PragmaticDndTarget
      dragType="block"
      getInitialData={() => ({ type: "block", blockId: id })}
      shouldHandleDrop={handleShouldHandleDrop}
      renderContent={renderedContent}
      allowedEdges={allowedEdges}
    />
  );
}

export default PragmaticBlock;
