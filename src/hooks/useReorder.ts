import * as u from "../utils";

interface UseReorderProps<T> {
  initialItems: T[];
}

interface UseReorderReturn<T> {
  handleMoveUp: (
    index: number,
    callback: (reorderedItems: T[]) => void,
  ) => void;
  handleMoveDown: (
    index: number,
    callback: (reorderedItems: T[]) => void,
  ) => void;
}

const useReorder = <T>({
  initialItems,
}: UseReorderProps<T>): UseReorderReturn<T> => {
  const handleMoveUp = (
    index: number,
    callback: (reorderedItems: T[]) => void,
  ) => {
    if (index <= 0) return;
    const reordered = u.reorder(initialItems, index, index - 1);

    callback(reordered);
  };

  const handleMoveDown = (
    index: number,
    callback: (reorderedItems: T[]) => void,
  ) => {
    if (index >= initialItems.length - 1) return;
    const reordered = u.reorder(initialItems, index, index + 1);

    callback(reordered);
  };

  return { handleMoveUp, handleMoveDown };
};

export default useReorder;
