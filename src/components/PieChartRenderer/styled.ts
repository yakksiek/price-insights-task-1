import styled from 'styled-components';

export const Wrapper = styled.div`
    --padding-s: 8px;
    --margin-l: 22px;
    --color-text-placeholder: #707090;
    display: flex;
    justify-content: center;
    padding: 0 var(--padding-s);

    @media (min-width: 1366px) {
        flex-direction: column;
    }

    @media (min-width: 1770px) {
        flex-direction: row;
    }
`;

export const ChartContainer = styled.div`
    display: flex;
    justify-content: end;
    flex: 1.25;

    @media (min-width: 1366px) {
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
        font-size: 13px;
        color: var(--color-text-placeholder);
    }

    @media (min-width: 1366px) {
        text-align: center;
    }
    @media (min-width: 1770px) {
        text-align: left;
    }
`;

export const Header = styled.header`
    h5 {
        font-size: 1rem;
    }
`;

export const Divider = styled.hr`
    border: 1px solid #e0e0ed;
    margin: var(--margin-l) 0;
    width: 394px;

    @media (min-width: 1366px) and (max-width: 1769px) {
        margin: var(--margin-l) auto;
    }
`;

export const LegendContent = styled.div`
    @media (min-width: 1366px) {
        margin: 0 auto;
    }

    @media (min-width: 1770px) {
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
        display: flex;
        justify-content: center;
        align-items: center;

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
        color: #111119;
        font-size: 14px;
        display: flex;
    }
`;

type AccentColors = 'blue' | 'orange';

export const Dot = styled.span<{ $color: AccentColors }>`
    --color-orange: '#EA5400';
    --color-blue: '#176AE5';
    display: inline-block;
    margin-right: 8px;
    width: 16px;
    height: 16px;
    border-radius: 50%;
    background: var(--color-${props => props.$color});
`;
