import { useState } from "react";
import { DropResult } from "@hello-pangea/dnd";

import * as u from "../utils";

type UseDragAndDropReturn<T> = {
  items: T[];
  handleOnDragEnd: (result: DropResult) => void;
  setItems: React.Dispatch<React.SetStateAction<T[]>>;
};

function usePangeaDnd<T>(initialItems: T[]): UseDragAndDropReturn<T> {
  const [items, setItems] = useState(initialItems);

  const handleOnDragEnd = (result: DropResult) => {
    const { destination, source } = result;

    if (!destination || destination.index === source.index) return;

    const reorderedBlockItems = u.reorder(
      items,
      source.index,
      destination.index,
    );
    setItems(reorderedBlockItems);
  };

  return {
    items,
    handleOnDragEnd,
    setItems,
  };
}

export default usePangeaDnd;
