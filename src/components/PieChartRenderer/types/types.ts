export type IVisibilityKey =
  | "campaignCovered"
  | "campaignNotCovered"
  | "monitoringCovered"
  | "monitoringNotCovered";

export type IVisibilityState = {
  [key in IVisibilityKey]: boolean;
};
