export type PieChartType = "campaigns" | "monitoring";

export type SetChartStateHandlerType = (
  chartType: PieChartType,
  value: number,
) => void;
