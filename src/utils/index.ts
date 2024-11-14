export const getCssVariable = (variable: string) =>
    getComputedStyle(document.documentElement).getPropertyValue(variable).trim();

export function reorder<T>(list: T[], startIndex: number, endIndex: number): T[] {
    const result = Array.from(list);
    const [movedItem] = result.splice(startIndex, 1);
    result.splice(endIndex, 0, movedItem);
    return result;
}
