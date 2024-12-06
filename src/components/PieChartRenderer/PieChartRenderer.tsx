import { FC } from "react";
import * as S from "./styled";
import { EyeSVG, SlashEyeSVG } from "../../assets/svg";
import { useChartRendererContext } from "./context";
import { IChartMetadata, IVisibilityKey } from "./types";

interface IProps {
  configData: IChartMetadata;
  chart: React.ReactNode;
  primaryValue: number;
}

export const PieChartRenderer: FC<IProps> = ({
  configData,
  chart,
  primaryValue,
}) => {
  const {
    labelPrimary,
    labelSecondary,
    header,
    subheader,
    id: chartId,
  } = configData;
  const { state: iconsState, toggleVisibility } = useChartRendererContext();

  const iconCoveredDataId = `${chartId}Covered` as IVisibilityKey;
  const iconNotCoveredDataId = `${chartId}NotCovered` as IVisibilityKey;
  const iconCoveredState = iconsState[iconCoveredDataId];
  const iconNotCoveredState = iconsState[iconNotCoveredDataId];

  const notCoveredValue = !iconNotCoveredState
    ? 0
    : iconCoveredState
      ? 100 - primaryValue
      : 100;
  const coveredValue = !iconNotCoveredState
    ? !iconCoveredState
      ? 0
      : 100
    : primaryValue;

  return (
    <S.Wrapper>
      <S.ChartContainer>{chart}</S.ChartContainer>
      <S.Legend>
        <S.Header>
          <h5>{header}</h5>
          <p>{subheader}</p>
        </S.Header>
        <S.Divider />
        <S.LegendContent>
          <S.Row>
            <div
              onClick={() => toggleVisibility(iconCoveredDataId)}
              className="icon-wrapper"
            >
              {iconCoveredState ? <EyeSVG /> : <SlashEyeSVG />}
            </div>
            <span className="data">{coveredValue}%</span>
            <span className="divider"></span>

            <p className="description">
              <S.Dot className="dot" $color="blue" />
              {labelPrimary}
            </p>
          </S.Row>
          <S.Row>
            <div
              onClick={() => toggleVisibility(iconNotCoveredDataId)}
              className="icon-wrapper"
            >
              {iconNotCoveredState ? <EyeSVG /> : <SlashEyeSVG />}
            </div>
            <span className="data">{notCoveredValue}%</span>
            <span className="divider"></span>

            <p className="description">
              <S.Dot className="dot" $color="orange" />
              {labelSecondary}
            </p>
          </S.Row>
        </S.LegendContent>
      </S.Legend>
    </S.Wrapper>
  );
};
