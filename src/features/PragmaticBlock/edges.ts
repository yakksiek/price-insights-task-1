export const allowedEdges = ['top', 'bottom'] as const;
export type Edge = (typeof allowedEdges)[number];
