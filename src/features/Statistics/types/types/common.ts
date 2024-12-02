export type VisibilityKey = 'campaignCovered' | 'campaignNotCovered' | 'monitoringCovered' | 'monitoringNotCovered';

export type VisibilityState = {
    [key in VisibilityKey]: boolean;
};

export type PieChartType = 'campaigns' | 'monitoring';

export type SetChartStateHandlerType = (chartType: PieChartType, value: number) => void;
