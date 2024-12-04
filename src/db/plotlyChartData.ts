import * as t from "../types";
import { getCssVariable } from "../utils";

const primaryBlue = getCssVariable("--primary-blue") || "rgb(23, 106, 229)";
const primaryPurple = getCssVariable("--primary-purple") || "rgb(113, 7, 226)";

export const plotlyChartConfigPricingCampaigns: t.PlotlyChartConfig = {
  configPrimaryData: 63,
  colorPrimary: primaryBlue,
  colorScheme: "blue",
};

export const plotlyChartConfigMonitoringData: t.PlotlyChartConfig = {
  configPrimaryData: 67,
  colorPrimary: primaryPurple,
  colorScheme: "purple",
};
