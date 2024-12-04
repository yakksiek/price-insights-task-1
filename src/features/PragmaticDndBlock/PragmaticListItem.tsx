import { Edge } from "@atlaskit/pragmatic-drag-and-drop-hitbox/dist/types/types";
import {
  BaseEventPayload,
  DropTargetLocalizedData,
  ElementDragType,
} from "@atlaskit/pragmatic-drag-and-drop/dist/types/internal-types";
import styled from "styled-components";
import DraggableHandle from "../../components/DraggableHandle";
import { ListItem } from "../../shared/block.types";
import PragmaticDndTarget from "./PragmaticDndTarget";

interface StyledListItemProps {
  $color: string;
}

const StyledListItem = styled.li<StyledListItemProps>`
  position: relative;
  background-color: ${(props) => props.$color};
  padding: 1rem;
  margin-bottom: 1rem;
  display: flex;
  align-items: center;
`;

interface PragmaticListItemProps {
  itemData: ListItem;
  isFirst: boolean;
}

function PragramaticListItem({ itemData, isFirst }: PragmaticListItemProps) {
  const { name, id } = itemData;
  const allowedEdges: Edge[] = isFirst ? ["top", "bottom"] : ["bottom"];

  const handleShouldHandleDrop = (
    args: BaseEventPayload<ElementDragType> & DropTargetLocalizedData,
  ) => {
    if (!args.source) return false;

    const draggableElement = args.source.data;
    const isCardType = draggableElement.type === "card";
    if (!isCardType) return false;

    if (args.location.current.dropTargets.length !== 2) return false;

    const [, destinationBlock] = args.location.current.dropTargets;
    const [, sourceBlock] = args.location.initial.dropTargets;
    const destinationBlockId = destinationBlock.data.blockId;
    const sourceBlockId = sourceBlock.data.blockId;

    // destination block must be the same as the starting block
    const isDestinationBlockCorrect = destinationBlockId === sourceBlockId;
    if (!isDestinationBlockCorrect) return false;

    // prevent dropping a card onto itself
    return draggableElement.cardId !== id;
  };

  const renderedContent = (handleRef: React.RefObject<HTMLDivElement>) => {
    return (
      <StyledListItem $color={name}>
        <div ref={handleRef}>
          <DraggableHandle marginRight={true} background={true} />
        </div>
        <p>{name}</p>
      </StyledListItem>
    );
  };

  return (
    <PragmaticDndTarget
      dragType="card"
      getInitialData={() => ({ type: "card", cardId: id })}
      shouldHandleDrop={handleShouldHandleDrop}
      renderContent={renderedContent}
      allowedEdges={allowedEdges}
    />
  );
}

export default PragramaticListItem;
