import styled from 'styled-components';
import { centerContentWithFlex } from '../../styles/shared';
import { Breakpoints } from '../../types/enums';

export const Wrapper = styled.div`
    display: flex;
    justify-content: center;
    padding: 0 var(--padding-s);

    @media ${Breakpoints.MediumLarge} {
        flex-direction: column;
    }

    @media ${Breakpoints.ExtraLarge} {
        flex-direction: row;
    }
`;

export const ChartContainer = styled.div`
    display: flex;
    justify-content: end;
    flex: 1.25;

    @media ${Breakpoints.MediumLarge} {
        justify-content: center;
        flex: 1;
    }
`;

export const Legend = styled.div`
    padding: var(--padding-s);
    flex: 2;
    display: flex;
    justify-content: center;
    flex-direction: column;

    p {
        font-size: 0.813rem;
        color: var(--text-placeholder);
    }

    @media ${Breakpoints.MediumLarge} {
        text-align: center;
    }
    @media ${Breakpoints.ExtraLarge} {
        text-align: left;
    }
`;

export const Header = styled.header`
    h5 {
        font-size: 1rem;
    }
`;

export const Divider = styled.hr`
    border: 1px solid rgba(224, 224, 237, 1);
    margin: var(--margin-l) 0;
    width: 394px;

    @media ${Breakpoints.MediumLarge} {
        margin: var(--margin-l) auto;
    }

    @media ${Breakpoints.ExtraLarge} {
        margin: var(--margin-l) 0;
    }
`;

export const LegendContent = styled.div`
    @media ${Breakpoints.MediumLarge} {
        margin: 0 auto;
    }

    @media ${Breakpoints.ExtraLarge} {
        margin: 0;
    }
`;

export const Row = styled.div`
    margin-bottom: var(--margin-l);
    display: flex;
    align-items: center;

    & > * {
        margin-right: 1rem;
    }

    .icon-wrapper {
        cursor: pointer;
        transition: transform 0.2s ease, box-shadow 0.2s ease;
        ${centerContentWithFlex}

        &:hover {
            transform: translateY(-2px);
        }
    }

    .data {
        width: 76px;
        font-size: 22px;
        font-weight: 300;
        line-height: 28.6px;
    }

    .divider {
        width: 8px;
        height: 1px;
        background-color: var(--text-placeholder);
        display: inline-block;
        vertical-align: middle;
    }

    .description {
        font-weight: 600;
        color: var(--font-color);
        font-size: 0.875rem;
        display: flex;
    }
`;

type AccentColors = 'blue' | 'orange';

export const Dot = styled.span<{ $color?: AccentColors }>`
    display: inline-block;
    margin-right: 0.5rem;
    width: 1rem;
    height: 1rem;
    border-radius: 50%;
    background: ${({ $color }) => ($color ? `var(--primary-${$color})` : 'var(--primary-blue)')};
`;
