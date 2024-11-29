export type VisibilityKey = 'campaignCovered' | 'campaignNotCovered' | 'monitoringCovered' | 'monitoringNotCovered';

export type VisibilityState = {
    [key in VisibilityKey]: boolean;
};
