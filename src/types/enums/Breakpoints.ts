import { WindowResolution } from './WindowResolution';

export enum Breakpoints {
    SmallLarge = `(min-width: ${WindowResolution.SmallLarge}px)`,
    MediumLarge = `(min-width: ${WindowResolution.MediumLarge}px)`,
    ExtraLarge = `(min-width: ${WindowResolution.ExtraLarge}px)`,
    FullHD = `(min-width: ${WindowResolution.FullHD}px)`,
}
