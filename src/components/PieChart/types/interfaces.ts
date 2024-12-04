import { PieChartType } from "./types";

export interface IChartData {
  id: PieChartType;
  primaryColor: string;
  primaryGradientColors: [string, string];
  primaryColorShadow: string;
  secondaryColor: string;
  secondaryGradientColors: [string, string];
}

export interface IThicknessPluginOptions {
  thickness: Array<[number, number]>;
}

export interface IGradientColorsOptions {
  primary: [string, string];
  secondary: [string, string];
}

export interface IShadowColorsOptions {
  primary: string;
}
