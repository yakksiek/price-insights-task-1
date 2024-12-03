import { PieChartType } from './types';

export interface ChartData {
    id: PieChartType;
    primaryColor: string;
    primaryGradientColors: [string, string];
    primaryColorShadow: string;
    secondaryColor: string;
    secondaryGradientColors: [string, string];
}

export interface ThicknessPluginOptions {
    thickness: Array<[number, number]>;
}

export interface GradientColorsOptions {
    primary: [string, string];
    secondary: [string, string];
}

export interface ShadowColorsOptions {
    primary: string;
}
