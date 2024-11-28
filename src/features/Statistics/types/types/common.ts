export type VisibilityKey =
    | 'campaign--covered'
    | 'campaign--not-covered'
    | 'monitoring--covered'
    | 'monitoring--not-covered';

export type VisibilityState = {
    [key in VisibilityKey]: boolean;
};
