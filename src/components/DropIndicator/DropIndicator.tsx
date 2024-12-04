import styled from "styled-components";
import { Edge } from "@atlaskit/pragmatic-drag-and-drop-hitbox/types";

const edgeClassMap = {
  top: "edge-top",
  bottom: "edge-bottom",
};

const StyledDropIndicatior = styled.div`
  position: absolute;
  z-index: 10;
  background-color: #1d4ed8;
  pointer-events: none;
  box-sizing: border-box;
  height: 2px;
  left: 4px;
  right: 0;

  &::before {
    content: "";
    width: 6px;
    height: 6px;
    position: absolute;
    border: 2px solid #1d4ed8;
    border-radius: 50%;
    top: -4px;
    left: -10px;
  }

  &.edge-top {
    top: calc(-0.65 * (8px + 2px));
  }

  &.edge-bottom {
    bottom: calc(-0.65 * (8px + 2px));
  }
`;

interface DropIndicatorProps {
  edge: Edge;
}

function DropIndicator({ edge }: DropIndicatorProps) {
  const edgeClass = edgeClassMap[edge as keyof typeof edgeClassMap] || "";

  return (
    <StyledDropIndicatior className={`${edgeClass}`}></StyledDropIndicatior>
  );
}

export default DropIndicator;
